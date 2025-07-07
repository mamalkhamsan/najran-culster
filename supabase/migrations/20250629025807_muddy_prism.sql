/*
  # إضافة حقل نوع التعاقد للأطباء
  
  1. تغييرات الجداول
    - إضافة حقل `contract_type` إلى جدول `users` للأطباء
    - إضافة صلاحية جديدة `manage_doctors` للتحكم في إدارة الأطباء
  
  2. الصلاحيات
    - إضافة صلاحية جديدة للمستخدمين المناسبين
*/

-- إضافة حقل نوع التعاقد للأطباء
ALTER TABLE users ADD COLUMN IF NOT EXISTS contract_type VARCHAR(20) CHECK (contract_type IN ('permanent', 'temporary'));

-- تحديث الأطباء الحاليين بنوع التعاقد
UPDATE users 
SET contract_type = 'temporary' 
WHERE role = 'doctor' AND contract_type IS NULL;

-- إضافة صلاحية جديدة لإدارة الأطباء
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES ('manage_doctors', 'إدارة الأطباء', 'Manage Doctors', 'admin')
ON CONFLICT (name) DO NOTHING;

-- إضافة الصلاحية الجديدة لمدير النظام الرئيسي
INSERT INTO user_permissions (user_id, permission_name, granted_by)
VALUES ('admin-001', 'manage_doctors', 'admin-001')
ON CONFLICT (user_id, permission_name) DO NOTHING;

-- إضافة الصلاحية الجديدة للمسؤول العام
INSERT INTO user_permissions (user_id, permission_name, granted_by)
VALUES ('admin-002', 'manage_doctors', 'admin-001')
ON CONFLICT (user_id, permission_name) DO NOTHING;

-- إضافة الصلاحية الجديدة لمدير المنشأة
INSERT INTO user_permissions (user_id, permission_name, granted_by)
VALUES ('facility-manager-001', 'manage_doctors', 'admin-001')
ON CONFLICT (user_id, permission_name) DO NOTHING;

-- إضافة الصلاحية الجديدة لرئيس القسم
INSERT INTO user_permissions (user_id, permission_name, granted_by)
VALUES ('dept-head-001', 'manage_doctors', 'admin-001')
ON CONFLICT (user_id, permission_name) DO NOTHING;

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