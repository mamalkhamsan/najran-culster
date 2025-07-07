/*
  # إضافة صلاحية طلب خدمة جديدة للمستخدمين
  
  1. الصلاحيات
    - إضافة صلاحية `request_new_service` للمستخدمين غير المرضى
    - المرضى لديهم صلاحية `request_services` بشكل تلقائي
  
  2. الوصول المقيد حسب الدور
    - مدير المنشأة يرى فقط طلبات منشأته
    - رئيس القسم يرى فقط طلبات قسمه
    - الموظف يرى فقط الطلبات المسندة إليه
*/

-- التأكد من وجود صلاحية طلب خدمة جديدة
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES ('request_new_service', 'طلب خدمة جديدة', 'Request New Service', 'operations')
ON CONFLICT (name) DO NOTHING;

-- منح الصلاحية للمستخدمين المناسبين
DO $$
BEGIN
    -- مدير النظام الرئيسي
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'request_new_service') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'request_new_service', 'admin-001');
    END IF;
    
    -- المسؤول العام
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'request_new_service') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'request_new_service', 'admin-001');
    END IF;
    
    -- مسؤول الأخبار
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'news-manager-001' AND permission_name = 'request_new_service') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('news-manager-001', 'request_new_service', 'admin-001');
    END IF;
    
    -- مسؤول الملف الإعلامي
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'media-manager-001' AND permission_name = 'request_new_service') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('media-manager-001', 'request_new_service', 'admin-001');
    END IF;
    
    -- مسؤول الإحصائيات
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'stats-manager-001' AND permission_name = 'request_new_service') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('stats-manager-001', 'request_new_service', 'admin-001');
    END IF;
    
    -- مسؤول الأسئلة الشائعة
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'faq-manager-001' AND permission_name = 'request_new_service') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('faq-manager-001', 'request_new_service', 'admin-001');
    END IF;
    
    -- الموظف
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'staff-001' AND permission_name = 'request_new_service') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('staff-001', 'request_new_service', 'admin-001');
    END IF;
    
    -- الطبيب
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'doctor-001' AND permission_name = 'request_new_service') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('doctor-001', 'request_new_service', 'admin-001');
    END IF;
    
    -- رئيس القسم
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'dept-head-001' AND permission_name = 'request_new_service') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('dept-head-001', 'request_new_service', 'admin-001');
    END IF;
    
    -- مدير المنشأة
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'facility-manager-001' AND permission_name = 'request_new_service') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('facility-manager-001', 'request_new_service', 'admin-001');
    END IF;
    
    -- ملاحظة: المرضى لديهم صلاحية 'request_services' بشكل تلقائي وليس 'request_new_service'
END $$;

-- إضافة سجل نشاط لتوثيق إضافة الصلاحية
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details)
VALUES (
  'admin-001', 
  'system_update', 
  'إضافة صلاحية طلب خدمة جديدة للمستخدمين', 
  'Added request new service permission for users', 
  '127.0.0.1', 
  '{"feature": "request_new_service", "status": "added"}'
);