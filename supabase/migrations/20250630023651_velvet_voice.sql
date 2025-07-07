/*
  # إضافة صلاحيات طلب الخدمة وتقييد الوصول حسب الدور
  
  1. صلاحيات جديدة
    - `request_new_service` - صلاحية طلب خدمة جديدة للموظفين
    - `view_all_requests` - صلاحية عرض جميع الطلبات للمسؤولين
  
  2. تحديثات الصلاحيات
    - منح صلاحية طلب خدمة جديدة للموظفين والأطباء والمسؤولين
    - منح صلاحية عرض جميع الطلبات للمسؤولين ومدراء المنشآت
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

-- إنشاء وظيفة للتحقق من صلاحية الوصول للطلبات
CREATE OR REPLACE FUNCTION can_access_request(user_id VARCHAR, request_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    user_role VARCHAR;
    user_facility VARCHAR;
    user_department VARCHAR;
    request_facility_id INTEGER;
    request_department_id INTEGER;
    request_assigned_to VARCHAR;
    has_view_all BOOLEAN;
BEGIN
    -- الحصول على معلومات المستخدم
    SELECT role, facility, department INTO user_role, user_facility, user_department
    FROM users
    WHERE id = user_id;
    
    -- الحصول على معلومات الطلب
    SELECT facility_id, department_id, assigned_to INTO request_facility_id, request_department_id, request_assigned_to
    FROM requests
    WHERE id = request_id;
    
    -- التحقق من صلاحية عرض جميع الطلبات
    SELECT EXISTS (
        SELECT 1 FROM user_permissions
        WHERE user_id = user_id AND permission_name = 'view_all_requests'
    ) INTO has_view_all;
    
    -- مدير النظام الرئيسي والمسؤول العام يمكنهم رؤية جميع الطلبات
    IF user_role IN ('system_admin', 'admin') THEN
        RETURN TRUE;
    END IF;
    
    -- مدير المنشأة يمكنه رؤية طلبات منشأته فقط
    IF user_role = 'manager' AND has_view_all THEN
        -- تحويل اسم المنشأة إلى معرف
        RETURN (
            SELECT EXISTS (
                SELECT 1 FROM facilities
                WHERE name_ar = user_facility AND id = request_facility_id
            )
        );
    END IF;
    
    -- رئيس القسم يمكنه رؤية طلبات قسمه فقط
    IF user_role = 'department_head' THEN
        -- تحويل اسم القسم إلى معرف
        RETURN (
            SELECT EXISTS (
                SELECT 1 FROM departments
                WHERE name_ar = user_department AND id = request_department_id
            )
        );
    END IF;
    
    -- الموظف يمكنه رؤية الطلبات المسندة إليه فقط
    IF user_role IN ('staff', 'doctor') THEN
        RETURN request_assigned_to = user_id;
    END IF;
    
    -- المريض يمكنه رؤية طلباته فقط
    IF user_role = 'patient' THEN
        RETURN (
            SELECT EXISTS (
                SELECT 1 FROM requests
                WHERE id = request_id AND user_id = user_id
            )
        );
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

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