/*
  # إضافة إدارة الأطباء مع نوع التعاقد
  
  1. تغييرات الجداول
    - التأكد من وجود حقل `contract_type` في جدول `users` للأطباء
    - إنشاء جدول `doctor_images` لتخزين صور الأطباء
  
  2. الصلاحيات
    - التأكد من وجود صلاحية `manage_doctors` للتحكم في إدارة الأطباء
*/

-- التأكد من وجود حقل نوع التعاقد للأطباء
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'contract_type'
    ) THEN
        ALTER TABLE users ADD COLUMN contract_type VARCHAR(20) CHECK (contract_type IN ('permanent', 'temporary'));
        
        -- تحديث الأطباء الحاليين بنوع التعاقد
        UPDATE users 
        SET contract_type = 'temporary' 
        WHERE role = 'doctor' AND contract_type IS NULL;
    END IF;
END $$;

-- إنشاء جدول لصور الأطباء إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS doctor_images (
  id SERIAL PRIMARY KEY,
  doctor_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  uploaded_by VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهرس للبحث السريع عن صور الأطباء
CREATE INDEX IF NOT EXISTS idx_doctor_images_doctor_id ON doctor_images(doctor_id);

-- التأكد من وجود صلاحية إدارة الأطباء
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'manage_doctors') THEN
        INSERT INTO permissions (name, description_ar, description_en, category)
        VALUES ('manage_doctors', 'إدارة الأطباء', 'Manage Doctors', 'admin');
    END IF;
END $$;

-- التأكد من إضافة الصلاحية للمستخدمين المناسبين
DO $$
BEGIN
    -- إضافة الصلاحية لمدير النظام الرئيسي
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'manage_doctors') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'manage_doctors', 'admin-001');
    END IF;
    
    -- إضافة الصلاحية للمسؤول العام
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'manage_doctors') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'manage_doctors', 'admin-001');
    END IF;
    
    -- إضافة الصلاحية لمدير المنشأة
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'facility-manager-001' AND permission_name = 'manage_doctors') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('facility-manager-001', 'manage_doctors', 'admin-001');
    END IF;
    
    -- إضافة الصلاحية لرئيس القسم
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'dept-head-001' AND permission_name = 'manage_doctors') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('dept-head-001', 'manage_doctors', 'admin-001');
    END IF;
END $$;

-- إضافة أطباء إضافيين للاختبار
DO $$
BEGIN
    -- إضافة طبيب جديد بعقد دائم
    IF NOT EXISTS (SELECT 1 FROM users WHERE national_id = '9876543210') THEN
        INSERT INTO users (id, name, national_id, password, role, email, mobile, facility, department, contract_type, is_active)
        VALUES ('doctor-002', 'د. سارة محمد العتيبي', '9876543210', 'Doctor@123', 'doctor', 'sarah.alotaibi@najran-health.gov.sa', '0512345679', 'مستشفى الملك خالد', 'قسم النساء والولادة', 'permanent', TRUE);
    END IF;
    
    -- إضافة طبيب جديد بعقد مؤقت
    IF NOT EXISTS (SELECT 1 FROM users WHERE national_id = '0123456789') THEN
        INSERT INTO users (id, name, national_id, password, role, email, mobile, facility, department, contract_type, is_active)
        VALUES ('doctor-003', 'د. عبدالله سعد الشهري', '0123456789', 'Doctor@123', 'doctor', 'abdullah.alshahri@najran-health.gov.sa', '0512345680', 'مستشفى نجران البلد', 'قسم الأطفال', 'temporary', TRUE);
    END IF;
END $$;

-- إضافة صلاحيات للأطباء الجدد
DO $$
BEGIN
    -- صلاحيات الطبيب الثاني
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'doctor-002' AND permission_name = 'view_requests') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
        ('doctor-002', 'view_requests', 'admin-001'),
        ('doctor-002', 'process_requests', 'admin-001'),
        ('doctor-002', 'send_notifications', 'admin-001'),
        ('doctor-002', 'view_medical_records', 'admin-001'),
        ('doctor-002', 'provide_consultations', 'admin-001'),
        ('doctor-002', 'doctor_availability', 'admin-001');
    END IF;
    
    -- صلاحيات الطبيب الثالث
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'doctor-003' AND permission_name = 'view_requests') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
        ('doctor-003', 'view_requests', 'admin-001'),
        ('doctor-003', 'process_requests', 'admin-001'),
        ('doctor-003', 'send_notifications', 'admin-001'),
        ('doctor-003', 'view_medical_records', 'admin-001'),
        ('doctor-003', 'provide_consultations', 'admin-001'),
        ('doctor-003', 'doctor_availability', 'admin-001');
    END IF;
END $$;

-- إضافة إتاحة للأطباء الجدد
INSERT INTO doctor_availability (doctor_id, is_available, available_from, available_to, available_days)
VALUES 
('doctor-002', TRUE, '09:00', '17:00', '1,2,3,4,5'),
('doctor-003', TRUE, '10:00', '18:00', '1,2,3,4,5')
ON CONFLICT (doctor_id) DO NOTHING;