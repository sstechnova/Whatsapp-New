/*
  # Update Agent Management Schema

  1. Changes
    - Add IF NOT EXISTS checks for table creation
    - Add IF NOT EXISTS checks for policies
    - Add IF NOT EXISTS checks for triggers
    - Add safe handling for existing objects

  2. Security
    - Maintain existing RLS policies
    - Ensure backward compatibility
*/

-- Safely create agents table if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'agents') THEN
    CREATE TABLE agents (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id),
      organization_id uuid REFERENCES organizations(id),
      permissions jsonb DEFAULT '{}',
      status text NOT NULL DEFAULT 'active',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS if not already enabled
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE tablename = 'agents'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Safely create policy if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agents' 
    AND policyname = 'Users can view agents in their organization'
  ) THEN
    CREATE POLICY "Users can view agents in their organization"
      ON agents
      FOR SELECT
      TO authenticated
      USING (
        organization_id IN (
          SELECT users.organization_id
          FROM users
          WHERE users.id = auth.uid()
        )
      );
  END IF;
END $$;

-- Safely create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_agent_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Safely create trigger if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'agents_updated_at'
  ) THEN
    CREATE TRIGGER agents_updated_at
      BEFORE UPDATE ON agents
      FOR EACH ROW
      EXECUTE FUNCTION update_agent_updated_at();
  END IF;
END $$;