/*
  # إضافة وظيفة الإخفاء للمسؤول الرئيسي
  
  1. جداول جديدة
    - `hidden_elements` - جدول لتخزين العناصر المخفية
  
  2. الصلاحيات
    - إضافة صلاحية جديدة `hide_elements` للتحكم في إخفاء العناصر
    - منح الصلاحية لمدير النظام الرئيسي
*/

-- إنشاء جدول العناصر المخفية
CREATE TABLE IF NOT EXISTS hidden_elements (
  id SERIAL PRIMARY KEY,
  element_type VARCHAR(50) NOT NULL, -- 'service', 'department', 'user', 'facility', 'dropdown_option', etc.
  element_id VARCHAR(100) NOT NULL, -- معرف العنصر المخفي
  hidden_by VARCHAR(50) NOT NULL REFERENCES users(id),
  hidden_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_hidden BOOLEAN DEFAULT TRUE,
  notes TEXT,
  UNIQUE(element_type, element_id)
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_hidden_elements_type_id ON hidden_elements(element_type, element_id);
CREATE INDEX IF NOT EXISTS idx_hidden_elements_is_hidden ON hidden_elements(is_hidden);

-- إضافة صلاحية إخفاء العناصر
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES ('hide_elements', 'إخفاء العناصر', 'Hide Elements', 'system')
ON CONFLICT (name) DO NOTHING;

-- منح الصلاحية لمدير النظام الرئيسي
INSERT INTO user_permissions (user_id, permission_name, granted_by)
VALUES ('admin-001', 'hide_elements', 'admin-001')
ON CONFLICT (user_id, permission_name) DO NOTHING;

-- إنشاء وظيفة للتحقق مما إذا كان العنصر مخفيًا
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

-- إنشاء وظيفة لإخفاء عنصر
CREATE OR REPLACE FUNCTION hide_element(element_type VARCHAR, element_id VARCHAR, user_id VARCHAR, notes TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO hidden_elements (element_type, element_id, hidden_by, notes)
  VALUES ($1, $2, $3, $4)
  ON CONFLICT (element_type, element_id) 
  DO UPDATE SET is_hidden = TRUE, hidden_by = $3, hidden_at = CURRENT_TIMESTAMP, notes = $4;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- إنشاء وظيفة لإلغاء إخفاء عنصر
CREATE OR REPLACE FUNCTION unhide_element(element_type VARCHAR, element_id VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE hidden_elements 
  SET is_hidden = FALSE 
  WHERE element_type = $1 AND element_id = $2;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- إضافة سجل نشاط لتتبع عمليات الإخفاء
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details)
VALUES ('admin-001', 'system_update', 'إضافة وظيفة الإخفاء للمسؤول الرئيسي', 'Added hide functionality for system administrator', '127.0.0.1', '{"feature": "hide_elements", "status": "added"}');