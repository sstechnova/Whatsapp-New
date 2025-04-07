/*
  # Create Tickets System Schema

  1. New Tables
    - `tickets`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (enum)
      - `priority` (enum)
      - `category` (text)
      - `assignee_id` (uuid, references auth.users)
      - `customer_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `due_date` (timestamptz)

    - `ticket_comments`
      - `id` (uuid, primary key)
      - `ticket_id` (uuid, references tickets)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `created_at` (timestamptz)

    - `ticket_tags`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamptz)

    - `ticket_tag_relations`
      - `ticket_id` (uuid, references tickets)
      - `tag_id` (uuid, references ticket_tags)
      - Primary key on (ticket_id, tag_id)

    - `ticket_activities`
      - `id` (uuid, primary key)
      - `ticket_id` (uuid, references tickets)
      - `user_id` (uuid, references auth.users)
      - `type` (enum)
      - `content` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for ticket assignees and customers
*/

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Drop existing types if they exist
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
        DROP TYPE ticket_status;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_priority') THEN
        DROP TYPE ticket_priority;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_activity_type') THEN
        DROP TYPE ticket_activity_type;
    END IF;
END $$;

-- Create enums
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_activity_type AS ENUM ('status_change', 'priority_change', 'assignment', 'comment', 'tag_added', 'tag_removed');

-- Drop existing tables if they exist
DROP TABLE IF EXISTS ticket_activities CASCADE;
DROP TABLE IF EXISTS ticket_tag_relations CASCADE;
DROP TABLE IF EXISTS ticket_tags CASCADE;
DROP TABLE IF EXISTS ticket_comments CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;

-- Create tickets table
CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status ticket_status NOT NULL DEFAULT 'open',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  category text,
  assignee_id uuid REFERENCES auth.users,
  customer_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  due_date timestamptz
);

-- Create ticket_comments table
CREATE TABLE ticket_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create ticket_tags table
CREATE TABLE ticket_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create ticket_tag_relations table
CREATE TABLE ticket_tag_relations (
  ticket_id uuid REFERENCES tickets ON DELETE CASCADE,
  tag_id uuid REFERENCES ticket_tags ON DELETE CASCADE,
  PRIMARY KEY (ticket_id, tag_id)
);

-- Create ticket_activities table
CREATE TABLE ticket_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  type ticket_activity_type NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Tickets policies
CREATE POLICY "Users can view tickets they created or are assigned to"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = customer_id OR 
    auth.uid() = assignee_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'support')
    )
  );

CREATE POLICY "Users can create tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own tickets or assigned tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = customer_id OR 
    auth.uid() = assignee_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'support')
    )
  );

-- Comments policies
CREATE POLICY "Users can view comments on accessible tickets"
  ON ticket_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_comments.ticket_id
      AND (
        tickets.customer_id = auth.uid() OR
        tickets.assignee_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'support')
        )
      )
    )
  );

CREATE POLICY "Users can create comments on accessible tickets"
  ON ticket_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_comments.ticket_id
      AND (
        tickets.customer_id = auth.uid() OR
        tickets.assignee_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'support')
        )
      )
    )
  );

-- Tags policies
CREATE POLICY "Everyone can view tags"
  ON ticket_tags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage tags"
  ON ticket_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Tag relations policies
CREATE POLICY "Users can view tag relations"
  ON ticket_tag_relations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins and support can manage tag relations"
  ON ticket_tag_relations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'support')
    )
  );

-- Activities policies
CREATE POLICY "Users can view activities on accessible tickets"
  ON ticket_activities
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_activities.ticket_id
      AND (
        tickets.customer_id = auth.uid() OR
        tickets.assignee_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'support')
        )
      )
    )
  );

-- Create functions
CREATE OR REPLACE FUNCTION update_ticket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS tickets_updated_at ON tickets;
CREATE TRIGGER tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_updated_at();

-- Create activity log function
CREATE OR REPLACE FUNCTION create_ticket_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Status change
    IF NEW.status <> OLD.status THEN
      INSERT INTO ticket_activities (ticket_id, user_id, type, content)
      VALUES (NEW.id, auth.uid(), 'status_change', 
        'Status changed from ' || OLD.status || ' to ' || NEW.status);
    END IF;
    
    -- Priority change
    IF NEW.priority <> OLD.priority THEN
      INSERT INTO ticket_activities (ticket_id, user_id, type, content)
      VALUES (NEW.id, auth.uid(), 'priority_change',
        'Priority changed from ' || OLD.priority || ' to ' || NEW.priority);
    END IF;
    
    -- Assignment change
    IF NEW.assignee_id IS DISTINCT FROM OLD.assignee_id THEN
      INSERT INTO ticket_activities (ticket_id, user_id, type, content)
      VALUES (NEW.id, auth.uid(), 'assignment',
        CASE 
          WHEN NEW.assignee_id IS NULL THEN 'Ticket unassigned'
          WHEN OLD.assignee_id IS NULL THEN 'Ticket assigned'
          ELSE 'Ticket reassigned'
        END);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create activity log trigger
DROP TRIGGER IF EXISTS tickets_activity_log ON tickets;
CREATE TRIGGER tickets_activity_log
  AFTER UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION create_ticket_activity();