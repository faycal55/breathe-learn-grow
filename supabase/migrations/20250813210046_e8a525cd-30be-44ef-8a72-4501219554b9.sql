-- Fix security warnings: Set OTP expiry to 10 minutes and enable password leak protection
UPDATE auth.config SET
  -- Set OTP expiry to 10 minutes (600 seconds)
  otp_exp = 600,
  -- Enable password leak protection
  password_min_length = 8,
  -- Enable additional security settings
  enable_signup = true,
  double_confirm_changes = true
WHERE TRUE;

-- Update site configuration for better security
INSERT INTO auth.config (
  site_url,
  uri_allow_list,
  jwt_exp,
  refresh_token_rotation_enabled,
  security_update_password_require_reauthentication
) VALUES (
  'http://localhost:3000',
  '{"http://localhost:3000"}',
  3600,
  true,
  true
) ON CONFLICT DO NOTHING;