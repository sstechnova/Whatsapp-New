/*
  # Create Users Menu Schema

  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `name` (text)
      - `permissions` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_hierarchies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `reports_to` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Create user_roles table
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  permissions jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_hierarchies table
CREATE TABLE user_hierarchies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  reports_to uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT different_users CHECK (user_id != reports_to)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hierarchies ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Super admins can manage roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
    )
  );

CREATE POLICY "Everyone can view roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_hierarchies
CREATE POLICY "Users can view hierarchies in their organization"
  ON user_hierarchies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_hierarchies.user_id
      AND users.organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Super admins can manage all hierarchies"
  ON user_hierarchies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
    )
  );

CREATE POLICY "Admins can manage hierarchies of their direct reports"
  ON user_hierarchies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
      AND EXISTS (
        SELECT 1 FROM user_hierarchies
        WHERE user_hierarchies.reports_to = auth.uid()
        AND user_hierarchies.user_id = user_hierarchies.user_id
      )
    )
  );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_user_role_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_hierarchy_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_role_updated_at();

CREATE TRIGGER user_hierarchies_updated_at
  BEFORE UPDATE ON user_hierarchies
  FOR EACH ROW
  EXECUTE FUNCTION update_user_hierarchy_updated_at();

-- Insert default roles
INSERT INTO user_roles (name, permissions) VALUES
  (
    'super_admin',
    '[
      "manage_users",
      "manage_roles",
      "manage_organizations",
      "manage_billing",
      "manage_settings",
      "view_reports",
      "manage_templates",
      "manage_campaigns",
      "manage_integrations"
    ]'
  ),
  (
    'admin',
    '[
      "manage_users",
      "view_reports",
      "manage_templates",
      "manage_campaigns"
    ]'
  ),
  (
    'agent',
    '[
      "view_assigned_users",
      "view_reports",
      "use_templates",
      "send_messages"
    ]'
  );

-- Add indexes
CREATE INDEX idx_user_hierarchies_user_id ON user_hierarchies(user_id);
CREATE INDEX idx_user_hierarchies_reports_to ON user_hierarchies(reports_to);