/*
  # إضافة صلاحيات الرد التلقائي
  
  1. الصلاحيات الجديدة
    - `add_auto_response` - صلاحية إضافة رد تلقائي
    - `edit_auto_response` - صلاحية تعديل رد تلقائي
    - `delete_auto_response` - صلاحية حذف رد تلقائي
  
  2. تحديثات
    - منح الصلاحيات للمستخدمين المناسبين
*/

-- إضافة صلاحيات الرد التلقائي
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES 
  ('add_auto_response', 'إضافة رد تلقائي', 'Add Auto Response', 'content'),
  ('edit_auto_response', 'تعديل رد تلقائي', 'Edit Auto Response', 'content'),
  ('delete_auto_response', 'حذف رد تلقائي', 'Delete Auto Response', 'content')
ON CONFLICT (name) DO NOTHING;

-- منح الصلاحيات للمستخدمين المناسبين
DO $$
BEGIN
    -- مدير النظام الرئيسي
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'add_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'add_auto_response', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'edit_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'edit_auto_response', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'delete_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'delete_auto_response', 'admin-001');
    END IF;
    
    -- المسؤول العام
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'add_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'add_auto_response', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'edit_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'edit_auto_response', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'delete_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'delete_auto_response', 'admin-001');
    END IF;
    
    -- مسؤول الأسئلة الشائعة
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'faq-manager-001' AND permission_name = 'add_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('faq-manager-001', 'add_auto_response', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'faq-manager-001' AND permission_name = 'edit_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('faq-manager-001', 'edit_auto_response', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'faq-manager-001' AND permission_name = 'delete_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('faq-manager-001', 'delete_auto_response', 'admin-001');
    END IF;
    
    -- مدير المنشأة
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'facility-manager-001' AND permission_name = 'add_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('facility-manager-001', 'add_auto_response', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'facility-manager-001' AND permission_name = 'edit_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('facility-manager-001', 'edit_auto_response', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'facility-manager-001' AND permission_name = 'delete_auto_response') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('facility-manager-001', 'delete_auto_response', 'admin-001');
    END IF;
END $$;

-- إضافة سجل نشاط لتوثيق إضافة الصلاحيات
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details)
VALUES (
  'admin-001', 
  'system_update', 
  'إضافة صلاحيات الرد التلقائي', 
  'Added auto response permissions', 
  '127.0.0.1', 
  '{"feature": "auto_response_permissions", "status": "added"}'
);