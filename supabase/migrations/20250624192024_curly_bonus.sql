-- إضافة حسابات تجريبية للمستخدمين الجدد
/*
  # إضافة مستخدمين جدد للاختبار

  1. مستخدمين جدد
    - طبيب (د. خالد محمد العتيبي)
    - رئيس قسم (د. سلطان عبدالله الشمري)
    - مدير منشأة (د. ناصر محمد القحطاني)
  
  2. صلاحيات
    - إضافة صلاحيات للمستخدمين الجدد
    - تحديث صلاحيات المستخدمين الحاليين
*/

-- التحقق من وجود المستخدمين قبل إضافتهم
DO $$
BEGIN
    -- إضافة الطبيب إذا لم يكن موجوداً
    IF NOT EXISTS (SELECT 1 FROM users WHERE national_id = '6543210987') THEN
        INSERT INTO users (id, name, national_id, password, role, email, mobile, facility, department, is_active)
        VALUES ('doctor-001', 'د. خالد محمد العتيبي', '6543210987', 'Doctor@123', 'doctor', 'khalid.alotaibi@najran-health.gov.sa', '0512345678', 'مستشفى الملك خالد', 'قسم الباطنة', TRUE);
    END IF;

    -- إضافة رئيس القسم إذا لم يكن موجوداً
    IF NOT EXISTS (SELECT 1 FROM users WHERE national_id = '7654321098') THEN
        INSERT INTO users (id, name, national_id, password, role, email, mobile, facility, department, is_active)
        VALUES ('dept-head-001', 'د. سلطان عبدالله الشمري', '7654321098', 'Head@123', 'department_head', 'sultan.alshammari@najran-health.gov.sa', '0523456789', 'مستشفى الملك خالد', 'قسم الطوارئ', TRUE);
    END IF;

    -- إضافة مدير المنشأة إذا لم يكن موجوداً
    IF NOT EXISTS (SELECT 1 FROM users WHERE national_id = '8765432109') THEN
        INSERT INTO users (id, name, national_id, password, role, email, mobile, facility, department, is_active)
        VALUES ('facility-manager-001', 'د. ناصر محمد القحطاني', '8765432109', 'Manager@123', 'manager', 'nasser.alqahtani@najran-health.gov.sa', '0534567890', 'مستشفى الملك خالد', 'إدارة المستشفى', TRUE);
    END IF;
END $$;

-- إضافة صلاحيات الطبيب
DO $$
BEGIN
    -- حذف الصلاحيات الحالية للطبيب إذا وجدت
    DELETE FROM user_permissions WHERE user_id = 'doctor-001';
    
    -- إضافة الصلاحيات الجديدة
    INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
    ('doctor-001', 'view_requests', 'admin-001'),
    ('doctor-001', 'process_requests', 'admin-001'),
    ('doctor-001', 'send_notifications', 'admin-001'),
    ('doctor-001', 'view_medical_records', 'admin-001'),
    ('doctor-001', 'provide_consultations', 'admin-001'),
    ('doctor-001', 'doctor_availability', 'admin-001'),
    ('doctor-001', 'live_display_management', 'admin-001');
END $$;

-- إضافة صلاحيات رئيس القسم
DO $$
BEGIN
    -- حذف الصلاحيات الحالية لرئيس القسم إذا وجدت
    DELETE FROM user_permissions WHERE user_id = 'dept-head-001';
    
    -- إضافة الصلاحيات الجديدة
    INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
    ('dept-head-001', 'view_requests', 'admin-001'),
    ('dept-head-001', 'process_requests', 'admin-001'),
    ('dept-head-001', 'send_notifications', 'admin-001'),
    ('dept-head-001', 'manage_staff', 'admin-001'),
    ('dept-head-001', 'view_statistics', 'admin-001'),
    ('dept-head-001', 'generate_reports', 'admin-001'),
    ('dept-head-001', 'assign_requests', 'admin-001'),
    ('dept-head-001', 'escalate_requests', 'admin-001'),
    ('dept-head-001', 'live_display_management', 'admin-001'),
    ('dept-head-001', 'view_medical_records', 'admin-001');
END $$;

-- إضافة صلاحيات مدير المنشأة
DO $$
BEGIN
    -- حذف الصلاحيات الحالية لمدير المنشأة إذا وجدت
    DELETE FROM user_permissions WHERE user_id = 'facility-manager-001';
    
    -- إضافة الصلاحيات الجديدة
    INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
    ('facility-manager-001', 'view_requests', 'admin-001'),
    ('facility-manager-001', 'process_requests', 'admin-001'),
    ('facility-manager-001', 'send_notifications', 'admin-001'),
    ('facility-manager-001', 'manage_staff', 'admin-001'),
    ('facility-manager-001', 'view_statistics', 'admin-001'),
    ('facility-manager-001', 'generate_reports', 'admin-001'),
    ('facility-manager-001', 'facility_management', 'admin-001'),
    ('facility-manager-001', 'department_management', 'admin-001'),
    ('facility-manager-001', 'service_management', 'admin-001'),
    ('facility-manager-001', 'assign_requests', 'admin-001'),
    ('facility-manager-001', 'escalate_requests', 'admin-001'),
    ('facility-manager-001', 'approve_services', 'admin-001'),
    ('facility-manager-001', 'service_availability', 'admin-001'),
    ('facility-manager-001', 'view_all_requests', 'admin-001'),
    ('facility-manager-001', 'live_display_management', 'admin-001');
END $$;

-- إضافة إتاحة الطبيب
INSERT INTO doctor_availability (doctor_id, is_available, available_from, available_to, available_days)
VALUES ('doctor-001', TRUE, '08:00', '16:00', '1,2,3,4,5')
ON CONFLICT (doctor_id) DO UPDATE
SET is_available = TRUE, available_from = '08:00', available_to = '16:00', available_days = '1,2,3,4,5';

-- إضافة سجلات نشاط للمستخدمين الجدد
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details) VALUES
('doctor-001', 'login', 'تسجيل دخول طبيب', 'Doctor login', '192.168.1.105', '{"browser": "Chrome", "os": "Windows 10", "device": "Desktop", "location": "Najran, Saudi Arabia"}'),
('dept-head-001', 'login', 'تسجيل دخول رئيس قسم', 'Department head login', '192.168.1.106', '{"browser": "Firefox", "os": "Windows 10", "device": "Desktop", "location": "Najran, Saudi Arabia"}'),
('facility-manager-001', 'login', 'تسجيل دخول مدير منشأة', 'Facility manager login', '192.168.1.107', '{"browser": "Edge", "os": "Windows 11", "device": "Desktop", "location": "Najran, Saudi Arabia"}');

-- إضافة إشعارات للمستخدمين الجدد
INSERT INTO notifications (user_id, title_ar, title_en, message_ar, message_en, type) VALUES
('doctor-001', 'طلب استشارة جديد', 'New Consultation Request', 'لديك طلب استشارة جديد من مريض', 'You have a new consultation request from a patient', 'info'),
('dept-head-001', 'تقرير أداء القسم', 'Department Performance Report', 'تم إصدار تقرير أداء القسم الشهري', 'Monthly department performance report has been issued', 'info'),
('facility-manager-001', 'طلب تصعيد', 'Escalation Request', 'تم تصعيد طلب خدمة لمراجعتك', 'A service request has been escalated for your review', 'warning');