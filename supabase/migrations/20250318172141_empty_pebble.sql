-- Create subscription_plans table
CREATE TABLE subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  currency_code text NOT NULL DEFAULT 'INR',
  billing_period text NOT NULL,
  features jsonb NOT NULL DEFAULT '[]',
  limits jsonb NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view active plans"
  ON subscription_plans
  FOR SELECT
  TO authenticated
  USING (is_active = true OR (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
    )
  ));

CREATE POLICY "Only super_admin can manage plans"
  ON subscription_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
    )
  );

-- Insert default plans with INR prices
INSERT INTO subscription_plans (name, description, price, currency_code, billing_period, features, limits) VALUES
  (
    'Free',
    'Basic features for small businesses',
    0,
    'INR',
    'monthly',
    '["Basic chat support", "Standard templates", "Single user"]',
    '{"contacts": 100, "messages_per_day": 50, "templates": 5}'
  ),
  (
    'Starter',
    'Essential features for growing businesses',
    2499,
    'INR',
    'monthly',
    '["Priority chat support", "Custom templates", "3 team members", "Basic analytics"]',
    '{"contacts": 500, "messages_per_day": 200, "templates": 15}'
  ),
  (
    'Professional',
    'Advanced features for established businesses',
    6999,
    'INR',
    'monthly',
    '["24/7 Priority support", "Advanced templates", "10 team members", "Advanced analytics", "API access"]',
    '{"contacts": 2000, "messages_per_day": 1000, "templates": 50}'
  ),
  (
    'Business',
    'Comprehensive solution for large businesses',
    16999,
    'INR',
    'monthly',
    '["Dedicated support", "Custom integrations", "Unlimited team members", "Advanced analytics", "API access", "Custom branding"]',
    '{"contacts": 10000, "messages_per_day": 5000, "templates": 200}'
  ),
  (
    'Enterprise',
    'Custom solutions for enterprise needs',
    49999,
    'INR',
    'monthly',
    '["Dedicated account manager", "Custom development", "Unlimited everything", "White-label solution", "Priority API access", "Custom analytics"]',
    '{"contacts": -1, "messages_per_day": -1, "templates": -1}'
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_subscription_plan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_plan_updated_at();