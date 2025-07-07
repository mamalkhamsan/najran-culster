/*
  # إضافة جدول المنشورات
  
  1. جداول جديدة
    - `publications` - جدول لتخزين منشورات الصفحة الرئيسية
  
  2. الصلاحيات
    - إضافة صلاحيات إدارة المنشورات
*/

-- إنشاء جدول المنشورات
CREATE TABLE IF NOT EXISTS publications (
  id SERIAL PRIMARY KEY,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  image_url VARCHAR(500) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  uploaded_by VARCHAR(50) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_publications_is_active ON publications(is_active);
CREATE INDEX IF NOT EXISTS idx_publications_display_order ON publications(display_order);

-- إضافة صلاحيات إدارة المنشورات
INSERT INTO permissions (name, description_ar, description_en, category)
VALUES 
  ('manage_publications', 'إدارة المنشورات', 'Manage Publications', 'content'),
  ('add_publications', 'إضافة منشورات', 'Add Publications', 'content'),
  ('edit_publications', 'تعديل المنشورات', 'Edit Publications', 'content'),
  ('delete_publications', 'حذف المنشورات', 'Delete Publications', 'content')
ON CONFLICT (name) DO NOTHING;

-- منح الصلاحيات للمستخدمين المناسبين
DO $$
BEGIN
    -- مدير النظام الرئيسي
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'manage_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'manage_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'add_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'add_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'edit_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'edit_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-001' AND permission_name = 'delete_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-001', 'delete_publications', 'admin-001');
    END IF;
    
    -- المسؤول العام
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'manage_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'manage_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'add_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'add_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'edit_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'edit_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'admin-002' AND permission_name = 'delete_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('admin-002', 'delete_publications', 'admin-001');
    END IF;
    
    -- مسؤول الملف الإعلامي
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'media-manager-001' AND permission_name = 'manage_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('media-manager-001', 'manage_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'media-manager-001' AND permission_name = 'add_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('media-manager-001', 'add_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'media-manager-001' AND permission_name = 'edit_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('media-manager-001', 'edit_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'media-manager-001' AND permission_name = 'delete_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('media-manager-001', 'delete_publications', 'admin-001');
    END IF;
    
    -- مسؤول الأخبار
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'news-manager-001' AND permission_name = 'manage_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('news-manager-001', 'manage_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'news-manager-001' AND permission_name = 'add_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('news-manager-001', 'add_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'news-manager-001' AND permission_name = 'edit_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('news-manager-001', 'edit_publications', 'admin-001');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = 'news-manager-001' AND permission_name = 'delete_publications') THEN
        INSERT INTO user_permissions (user_id, permission_name, granted_by)
        VALUES ('news-manager-001', 'delete_publications', 'admin-001');
    END IF;
END $$;

-- إضافة بيانات تجريبية للمنشورات
INSERT INTO publications (title_ar, title_en, image_url, display_order, is_active, uploaded_by)
VALUES 
  ('منشور تجمع نجران الصحي', 'Najran Health Cluster Publication', '/4a20a1bf-4fee-433c-8f65-93ceab5a9ca7.jfif', 1, TRUE, 'media-manager-001'),
  ('الملف الإعلامي', 'Media Kit', '/118ac0b2-1902-446c-8a11-b0ef86daa72c.jfif', 2, TRUE, 'media-manager-001'),
  ('منشور الصحة العامة', 'Public Health Publication', '/758 copy.jpeg', 3, TRUE, 'media-manager-001'),
  ('منشور التوعية الصحية', 'Health Awareness Publication', '/984 copy.jfif', 4, TRUE, 'media-manager-001'),
  ('منشور الخدمات الصحية', 'Health Services Publication', '/9933.jfif', 5, TRUE, 'media-manager-001')
ON CONFLICT DO NOTHING;

-- إضافة سجل نشاط لتوثيق إضافة الجدول
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details)
VALUES (
  'admin-001', 
  'system_update', 
  'إضافة جدول المنشورات', 
  'Added publications table', 
  '127.0.0.1', 
  '{"feature": "publications", "status": "added"}'
);