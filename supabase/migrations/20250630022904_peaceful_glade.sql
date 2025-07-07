/*
  # إضافة صلاحية طلب خدمة جديدة وتحديث صلاحيات المستخدمين
  
  1. صلاحيات جديدة
    - `request_new_service` - صلاحية طلب خدمة جديدة
  
  2. تحديثات
    - منح الصلاحية للمستخدمين المناسبين
    - تحديد صلاحيات الوصول حسب الدور
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

-- إضافة صلاحية عرض جميع الطلبات
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES ('view_all_requests', 'عرض جميع الطلبات', 'View All Requests', 'operations')
ON CONFLICT (name) DO NOTHING;

-- منح صلاحية عرض جميع الطلبات للمستخدمين المناسبين
DO $$
BEGIN
    -- مدير النظام الرئيسي
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'view_all_requests') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'view_all_requests', 'admin-001');
    END IF;
    
    -- المسؤول العام
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'view_all_requests') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'view_all_requests', 'admin-001');
    END IF;
    
    -- مدير المنشأة (يرى فقط طلبات منشأته)
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'facility-manager-001' AND permission_name = 'view_all_requests') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('facility-manager-001', 'view_all_requests', 'admin-001');
    END IF;
END $$;

-- إضافة سجل نشاط لتوثيق إضافة الصلاحيات
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details)
VALUES (
  'admin-001', 
  'system_update', 
  'تحديث صلاحيات المستخدمين وتقييد الوصول حسب الدور', 
  'Updated user permissions and role-based access restrictions', 
  '127.0.0.1', 
  '{"feature": "role_based_access", "status": "updated"}'
);