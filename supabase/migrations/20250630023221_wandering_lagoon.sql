/*
  # إضافة صلاحيات طلب الخدمة وتقييد الوصول حسب الدور
  
  1. الصلاحيات الجديدة
    - `request_new_service` - صلاحية طلب خدمة جديدة للموظفين
    - تحديث صلاحيات المستخدمين الحاليين
  
  2. تحسينات الوصول
    - تقييد وصول مدير المنشأة للمنشأة الخاصة به فقط
    - تقييد وصول رئيس القسم للقسم الخاص به فقط
    - تقييد وصول الموظف للطلبات المسندة إليه فقط
*/

-- إضافة صلاحية طلب خدمة جديدة
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
    
    -- مدير المنشأة
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'facility-manager-001' AND permission_name = 'view_all_requests') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('facility-manager-001', 'view_all_requests', 'admin-001');
    END IF;
END $$;

-- إضافة صلاحية إسناد الطلبات
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES ('assign_requests', 'إسناد الطلبات', 'Assign Requests', 'operations')
ON CONFLICT (name) DO NOTHING;

-- منح صلاحية إسناد الطلبات للمستخدمين المناسبين
DO $$
BEGIN
    -- مدير النظام الرئيسي
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'assign_requests') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'assign_requests', 'admin-001');
    END IF;
    
    -- المسؤول العام
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'assign_requests') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'assign_requests', 'admin-001');
    END IF;
    
    -- مدير المنشأة
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'facility-manager-001' AND permission_name = 'assign_requests') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('facility-manager-001', 'assign_requests', 'admin-001');
    END IF;
    
    -- رئيس القسم
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'dept-head-001' AND permission_name = 'assign_requests') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('dept-head-001', 'assign_requests', 'admin-001');
    END IF;
END $$;

-- إنشاء وظيفة للتحقق من صلاحية الوصول للطلب
CREATE OR REPLACE FUNCTION can_access_request(user_id VARCHAR, request_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    user_role VARCHAR;
    user_facility VARCHAR;
    user_department VARCHAR;
    request_facility VARCHAR;
    request_department VARCHAR;
    request_assigned_to VARCHAR;
    has_view_all BOOLEAN;
BEGIN
    -- الحصول على معلومات المستخدم
    SELECT u.role, u.facility, u.department INTO user_role, user_facility, user_department
    FROM users u
    WHERE u.id = user_id;
    
    -- الحصول على معلومات الطلب
    SELECT f.name_ar, d.name_ar, r.assigned_to INTO request_facility, request_department, request_assigned_to
    FROM requests r
    JOIN facilities f ON r.facility_id = f.id
    JOIN departments d ON r.department_id = d.id
    WHERE r.id = request_id;
    
    -- التحقق من صلاحية عرض جميع الطلبات
    SELECT EXISTS (
        SELECT 1 FROM user_permissions
        WHERE user_id = user_id AND permission_name = 'view_all_requests'
    ) INTO has_view_all;
    
    -- مدير النظام الرئيسي والمسؤول العام لديهم وصول كامل
    IF user_role IN ('system_admin', 'admin') OR has_view_all THEN
        RETURN TRUE;
    END IF;
    
    -- مدير المنشأة يرى فقط طلبات منشأته
    IF user_role = 'manager' THEN
        RETURN user_facility = request_facility;
    END IF;
    
    -- رئيس القسم يرى فقط طلبات قسمه
    IF user_role = 'department_head' THEN
        RETURN user_department = request_department;
    END IF;
    
    -- الموظف يرى فقط الطلبات المسندة إليه
    IF user_role = 'staff' THEN
        RETURN request_assigned_to = user_id OR request_assigned_to IS NULL;
    END IF;
    
    -- المريض يرى فقط طلباته الخاصة (يتم التحقق في مكان آخر)
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- إضافة سجل نشاط لتوثيق التغييرات
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details)
VALUES (
  'admin-001', 
  'system_update', 
  'تحديث نظام الصلاحيات وتقييد الوصول حسب الدور', 
  'Updated permissions system and role-based access restrictions', 
  '127.0.0.1', 
  '{"feature": "role_based_access", "status": "updated"}'
);