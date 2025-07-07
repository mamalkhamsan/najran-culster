/*
  # Fix Hidden Elements Functionality
  
  1. New Tables
    - `hidden_elements` - Table to track which elements are hidden
  
  2. New Functions
    - `is_element_hidden` - Check if an element is hidden
    - `hide_element` - Hide an element
    - `unhide_element` - Unhide an element
    - `get_hidden_elements` - Get all hidden elements
  
  3. New Permissions
    - `hide_elements` - Permission to hide elements
*/

-- Create hidden elements table if it doesn't exist
CREATE TABLE IF NOT EXISTS hidden_elements (
  id SERIAL PRIMARY KEY,
  element_type VARCHAR(50) NOT NULL, -- 'service', 'department', 'user', 'facility', etc.
  element_id VARCHAR(100) NOT NULL,
  element_name VARCHAR(255), -- Name for display purposes
  hidden_by VARCHAR(50) NOT NULL REFERENCES users(id),
  hidden_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_hidden BOOLEAN DEFAULT TRUE,
  notes TEXT,
  UNIQUE(element_type, element_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_hidden_elements_type_id ON hidden_elements(element_type, element_id);
CREATE INDEX IF NOT EXISTS idx_hidden_elements_is_hidden ON hidden_elements(is_hidden);

-- Add hide_elements permission if it doesn't exist
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES ('hide_elements', 'إخفاء العناصر', 'Hide Elements', 'system')
ON CONFLICT (name) DO NOTHING;

-- Grant permission to system administrator
INSERT INTO user_permissions (user_id, permission_name, granted_by)
VALUES ('admin-001', 'hide_elements', 'admin-001')
ON CONFLICT (user_id, permission_name) DO NOTHING;

-- Function to check if an element is hidden
CREATE OR REPLACE FUNCTION is_element_hidden(element_type VARCHAR, element_id VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM hidden_elements 
    WHERE element_type = $1 
    AND element_id = $2 
    AND is_hidden = TRUE
  );
END;
$$ LANGUAGE plpgsql;

-- Function to hide an element
CREATE OR REPLACE FUNCTION hide_element(element_type VARCHAR, element_id VARCHAR, element_name VARCHAR, user_id VARCHAR, notes TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO hidden_elements (element_type, element_id, element_name, hidden_by, notes)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (element_type, element_id) 
  DO UPDATE SET is_hidden = TRUE, element_name = $3, hidden_by = $4, hidden_at = CURRENT_TIMESTAMP, notes = $5;
  
  -- Add activity log
  INSERT INTO activity_logs (user_id, action, description_ar, description_en, details)
  VALUES (
    $4, 
    'hide_element', 
    'إخفاء عنصر: ' || $3, 
    'Hide element: ' || $3, 
    jsonb_build_object('element_type', $1, 'element_id', $2, 'element_name', $3)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to unhide an element
CREATE OR REPLACE FUNCTION unhide_element(element_type VARCHAR, element_id VARCHAR, user_id VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  element_name VARCHAR;
BEGIN
  -- Get element name before update
  SELECT he.element_name INTO element_name
  FROM hidden_elements he
  WHERE he.element_type = $1 AND he.element_id = $2;

  -- Update hidden status
  UPDATE hidden_elements 
  SET is_hidden = FALSE 
  WHERE element_type = $1 AND element_id = $2;
  
  -- Add activity log
  INSERT INTO activity_logs (user_id, action, description_ar, description_en, details)
  VALUES (
    $3, 
    'unhide_element', 
    'إظهار عنصر: ' || element_name, 
    'Unhide element: ' || element_name, 
    jsonb_build_object('element_type', $1, 'element_id', $2, 'element_name', element_name)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get all hidden elements
CREATE OR REPLACE FUNCTION get_hidden_elements()
RETURNS TABLE (
  id INTEGER,
  element_type VARCHAR,
  element_id VARCHAR,
  element_name VARCHAR,
  hidden_by VARCHAR,
  hidden_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    he.id,
    he.element_type,
    he.element_id,
    he.element_name,
    he.hidden_by,
    he.hidden_at,
    he.notes
  FROM hidden_elements he
  WHERE he.is_hidden = TRUE
  ORDER BY he.hidden_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Add activity log for this migration
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details)
VALUES (
  'admin-001', 
  'system_update', 
  'تحديث نظام إخفاء العناصر', 
  'Updated element hiding system', 
  '127.0.0.1', 
  '{"feature": "hide_elements", "status": "updated"}'
);