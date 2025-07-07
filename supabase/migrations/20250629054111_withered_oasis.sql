/*
  # إضافة وظيفة إخفاء العناصر للمسؤول الرئيسي
  
  1. تغييرات الجداول
    - التأكد من وجود جدول `hidden_elements` لتخزين العناصر المخفية
    - إضافة صلاحية `hide_elements` للمسؤول الرئيسي
  
  2. الوظائف
    - إنشاء وظائف للتحقق من حالة الإخفاء وإدارتها
*/

-- التأكد من وجود جدول العناصر المخفية
CREATE TABLE IF NOT EXISTS hidden_elements (
  id SERIAL PRIMARY KEY,
  element_type VARCHAR(50) NOT NULL, -- 'service', 'department', 'user', 'facility', 'dropdown_option', etc.
  element_id VARCHAR(100) NOT NULL, -- معرف العنصر المخفي
  element_name VARCHAR(255), -- اسم العنصر للعرض
  hidden_by VARCHAR(50) NOT NULL REFERENCES users(id),
  hidden_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_hidden BOOLEAN DEFAULT TRUE,
  notes TEXT,
  UNIQUE(element_type, element_id)
);

-- إنشاء فهارس للبحث السريع إذا لم تكن موجودة
CREATE INDEX IF NOT EXISTS idx_hidden_elements_type_id ON hidden_elements(element_type, element_id);
CREATE INDEX IF NOT EXISTS idx_hidden_elements_is_hidden ON hidden_elements(is_hidden);

-- إضافة صلاحية إخفاء العناصر إذا لم تكن موجودة
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES ('hide_elements', 'إخفاء العناصر', 'Hide Elements', 'system')
ON CONFLICT (name) DO NOTHING;

-- منح الصلاحية لمدير النظام الرئيسي إذا لم تكن ممنوحة
INSERT INTO user_permissions (user_id, permission_name, granted_by)
VALUES ('admin-001', 'hide_elements', 'admin-001')
ON CONFLICT (user_id, permission_name) DO NOTHING;

-- إنشاء أو تحديث وظيفة للتحقق مما إذا كان العنصر مخفيًا
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

-- إنشاء أو تحديث وظيفة لإخفاء عنصر
CREATE OR REPLACE FUNCTION hide_element(element_type VARCHAR, element_id VARCHAR, element_name VARCHAR, user_id VARCHAR, notes TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO hidden_elements (element_type, element_id, element_name, hidden_by, notes)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (element_type, element_id) 
  DO UPDATE SET is_hidden = TRUE, element_name = $3, hidden_by = $4, hidden_at = CURRENT_TIMESTAMP, notes = $5;
  
  -- إضافة سجل نشاط
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

-- إنشاء أو تحديث وظيفة لإلغاء إخفاء عنصر
CREATE OR REPLACE FUNCTION unhide_element(element_type VARCHAR, element_id VARCHAR, user_id VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  element_name VARCHAR;
BEGIN
  -- الحصول على اسم العنصر قبل التحديث
  SELECT he.element_name INTO element_name
  FROM hidden_elements he
  WHERE he.element_type = $1 AND he.element_id = $2;

  -- تحديث حالة الإخفاء
  UPDATE hidden_elements 
  SET is_hidden = FALSE 
  WHERE element_type = $1 AND element_id = $2;
  
  -- إضافة سجل نشاط
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

-- إنشاء وظيفة للحصول على جميع العناصر المخفية
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

-- إضافة سجل نشاط لتوثيق إضافة الميزة
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details)
VALUES (
  'admin-001', 
  'system_update', 
  'تحديث نظام إخفاء العناصر', 
  'Updated element hiding system', 
  '127.0.0.1', 
  '{"feature": "hide_elements", "status": "updated"}'
);