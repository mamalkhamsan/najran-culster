/*
  # إضافة نظام تقييم الخدمات
  
  1. جداول جديدة
    - `service_ratings` - جدول تقييمات الخدمات
  
  2. العلاقات
    - ربط التقييمات بالمستخدمين والطلبات
  
  3. الصلاحيات
    - إضافة صلاحية `view_ratings` للمسؤولين
*/

-- إنشاء جدول تقييمات الخدمات
CREATE TABLE IF NOT EXISTS service_ratings (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  request_id INTEGER REFERENCES requests(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_service_ratings_user_id ON service_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_service_ratings_request_id ON service_ratings(request_id);

-- إضافة صلاحية عرض التقييمات
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES ('view_ratings', 'عرض تقييمات الخدمات', 'View Service Ratings', 'reports')
ON CONFLICT (name) DO NOTHING;

-- إضافة صلاحية إدارة التقييمات
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES ('manage_ratings', 'إدارة تقييمات الخدمات', 'Manage Service Ratings', 'reports')
ON CONFLICT (name) DO NOTHING;

-- منح الصلاحيات للمستخدمين المناسبين
DO $$
BEGIN
    -- مدير النظام الرئيسي
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'view_ratings') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'view_ratings', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'manage_ratings') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'manage_ratings', 'admin-001');
    END IF;
    
    -- المسؤول العام
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'view_ratings') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'view_ratings', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'manage_ratings') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'manage_ratings', 'admin-001');
    END IF;
    
    -- مدير المنشأة
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'facility-manager-001' AND permission_name = 'view_ratings') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('facility-manager-001', 'view_ratings', 'admin-001');
    END IF;
END $$;

-- إنشاء وظيفة لحساب متوسط التقييمات
CREATE OR REPLACE FUNCTION get_average_rating()
RETURNS NUMERIC AS $$
BEGIN
  RETURN (SELECT AVG(rating)::NUMERIC(3,2) FROM service_ratings);
END;
$$ LANGUAGE plpgsql;

-- إنشاء وظيفة لحساب متوسط التقييمات لطلب معين
CREATE OR REPLACE FUNCTION get_request_average_rating(request_id INTEGER)
RETURNS NUMERIC AS $$
BEGIN
  RETURN (SELECT AVG(rating)::NUMERIC(3,2) FROM service_ratings WHERE request_id = $1);
END;
$$ LANGUAGE plpgsql;

-- إضافة بيانات تجريبية للتقييمات
INSERT INTO service_ratings (user_id, request_id, rating, feedback)
VALUES 
('patient-001', 3, 5, 'خدمة ممتازة وسريعة'),
('patient-001', 2, 4, 'خدمة جيدة ولكن كان هناك بعض التأخير')
ON CONFLICT DO NOTHING;

-- إضافة سجل نشاط لتوثيق إضافة الميزة
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details)
VALUES (
  'admin-001', 
  'system_update', 
  'إضافة نظام تقييم الخدمات', 
  'Added service rating system', 
  '127.0.0.1', 
  '{"feature": "service_ratings", "status": "added"}'
);