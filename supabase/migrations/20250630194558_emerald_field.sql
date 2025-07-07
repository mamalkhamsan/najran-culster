/*
  # إضافة صلاحية طلب خدمة للمرضى فقط
  
  1. الصلاحيات
    - إضافة صلاحية `patient_request_service` للمرضى فقط
    - إزالة صلاحية `request_new_service` من المستخدمين غير المرضى
  
  2. تحديثات
    - تحديث صلاحيات المستخدمين
*/

-- إضافة صلاحية طلب خدمة للمرضى فقط
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES ('patient_request_service', 'طلب خدمة للمرضى فقط', 'Service Request for Patients Only', 'patient')
ON CONFLICT (name) DO NOTHING;

-- منح الصلاحية للمرضى
DO $$
BEGIN
    -- إضافة الصلاحية للمرضى
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'patient-001' AND permission_name = 'patient_request_service') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('patient-001', 'patient_request_service', 'admin-001');
    END IF;
    
    -- إزالة صلاحية request_new_service من المستخدمين غير المرضى
    DELETE FROM user_permissions 
    WHERE permission_name = 'request_new_service';
END $$;

-- إضافة سجل نشاط لتوثيق التغييرات
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details)
VALUES (
  'admin-001', 
  'system_update', 
  'تقييد صلاحية طلب الخدمة للمرضى فقط', 
  'Restricted service request permission to patients only', 
  '127.0.0.1', 
  '{"feature": "patient_request_service", "status": "added"}'
);