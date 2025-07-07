/*
  # قاعدة بيانات تجمع نجران الصحي
  
  1. جداول جديدة
    - `users` - جدول المستخدمين
    - `permissions` - جدول الصلاحيات
    - `user_permissions` - جدول ربط المستخدمين بالصلاحيات
    - `facilities` - جدول المنشآت الصحية
    - `departments` - جدول الأقسام
    - `services` - جدول الخدمات
    - `requests` - جدول الطلبات
    - `news` - جدول الأخبار
    - `hero_images` - جدول صور البطل
    - `achievements` - جدول الإنجازات
    - `faqs` - جدول الأسئلة الشائعة
    - `notifications` - جدول الإشعارات
    - `activity_logs` - جدول سجل النشاطات
    - `doctor_availability` - جدول إتاحة الأطباء
    - `request_assignments` - جدول إسناد الطلبات
    - `request_reports` - جدول بلاغات الطلبات
  
  2. الفهارس والعلاقات
    - إنشاء فهارس لتحسين الأداء
    - إنشاء علاقات بين الجداول
  
  3. البيانات الأولية
    - إدراج بيانات المستخدمين الافتراضيين
    - إدراج بيانات الصلاحيات
    - إدراج بيانات المنشآت والأقسام والخدمات
*/

-- إنشاء الجداول

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  national_id VARCHAR(10) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'staff', 'department_head', 'manager', 'supervisor', 'admin', 'system_admin', 'doctor')),
  email VARCHAR(255),
  mobile VARCHAR(15) NOT NULL,
  facility VARCHAR(255),
  department VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- جدول الصلاحيات
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول ربط المستخدمين بالصلاحيات
CREATE TABLE IF NOT EXISTS user_permissions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  permission_name VARCHAR(100) REFERENCES permissions(name) ON DELETE CASCADE,
  granted_by VARCHAR(50) REFERENCES users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, permission_name)
);

-- جدول المنشآت الصحية
CREATE TABLE IF NOT EXISTS facilities (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('hospital', 'specialized_center', 'health_center')),
  parent_id INTEGER REFERENCES facilities(id),
  address TEXT,
  phone VARCHAR(15),
  email VARCHAR(255),
  manager_id VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- جدول الأقسام
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  facility_id INTEGER NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  head_id VARCHAR(50) REFERENCES users(id),
  description_ar TEXT,
  description_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- جدول الخدمات
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  estimated_duration INTEGER, -- بالدقائق
  price DECIMAL(10,2),
  is_emergency BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  approved_by VARCHAR(50) REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- جدول إتاحة الأطباء
CREATE TABLE IF NOT EXISTS doctor_availability (
  id SERIAL PRIMARY KEY,
  doctor_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT FALSE,
  available_from TIME,
  available_to TIME,
  available_days VARCHAR(50), -- e.g. "1,2,3,4,5" for weekdays
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول الطلبات
CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  request_number VARCHAR(20) UNIQUE NOT NULL,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  facility_id INTEGER NOT NULL REFERENCES facilities(id),
  department_id INTEGER NOT NULL REFERENCES departments(id),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'cancelled', 'rejected')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  notes TEXT,
  assigned_to VARCHAR(50) REFERENCES users(id),
  assigned_at TIMESTAMP WITH TIME ZONE,
  queue_number INTEGER,
  requested_date DATE,
  requested_time TIME,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول إسناد الطلبات
CREATE TABLE IF NOT EXISTS request_assignments (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  assigned_by VARCHAR(50) NOT NULL REFERENCES users(id),
  assigned_to VARCHAR(50) NOT NULL REFERENCES users(id),
  assignment_reason TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول بلاغات الطلبات
CREATE TABLE IF NOT EXISTS request_reports (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  reported_by VARCHAR(50) NOT NULL REFERENCES users(id),
  report_reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  resolved_by VARCHAR(50) REFERENCES users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأخبار
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title_ar VARCHAR(500) NOT NULL,
  title_en VARCHAR(500) NOT NULL,
  excerpt_ar TEXT,
  excerpt_en TEXT,
  content_ar TEXT,
  content_en TEXT,
  image_url VARCHAR(500),
  category VARCHAR(100),
  author_id VARCHAR(50) NOT NULL REFERENCES users(id),
  is_published BOOLEAN DEFAULT FALSE,
  publish_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول صور البطل
CREATE TABLE IF NOT EXISTS hero_images (
  id SERIAL PRIMARY KEY,
  title_ar VARCHAR(255),
  title_en VARCHAR(255),
  image_url VARCHAR(500) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  uploaded_by VARCHAR(50) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول الإنجازات
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  year VARCHAR(4),
  icon VARCHAR(50),
  color VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(50) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأسئلة الشائعة
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question_ar TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  auto_response BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(50) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  message_ar TEXT NOT NULL,
  message_en TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  related_id VARCHAR(50),
  related_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول سجل النشاطات
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_users_national_id ON users(national_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_date ON requests(requested_date);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX IF NOT EXISTS idx_request_assignments_request_id ON request_assignments(request_id);
CREATE INDEX IF NOT EXISTS idx_request_reports_request_id ON request_reports(request_id);

-- إنشاء views مفيدة
CREATE OR REPLACE VIEW user_permissions_view AS
SELECT 
  u.id,
  u.name,
  u.role,
  ARRAY_AGG(up.permission_name) as permissions
FROM users u
LEFT JOIN user_permissions up ON u.id = up.user_id
GROUP BY u.id, u.name, u.role;

CREATE OR REPLACE VIEW active_requests_view AS
SELECT 
  r.*,
  u.name as user_name,
  s.name_ar as service_name_ar,
  s.name_en as service_name_en,
  f.name_ar as facility_name_ar,
  f.name_en as facility_name_en,
  d.name_ar as department_name_ar,
  d.name_en as department_name_en
FROM requests r
JOIN users u ON r.user_id = u.id
JOIN services s ON r.service_id = s.id
JOIN facilities f ON r.facility_id = f.id
JOIN departments d ON r.department_id = d.id
WHERE r.status IN ('pending', 'in_progress');

-- إدراج البيانات الأساسية

-- إدراج المستخدمين
INSERT INTO users (id, name, national_id, password, role, email, mobile, facility, department, is_active) VALUES
('admin-001', 'مدير النظام الرئيسي', '1111111111', 'Admin@2025', 'system_admin', 'system.admin@najran-health.gov.sa', '0545048999', 'تجمع نجران الصحي', 'إدارة تقنية المعلومات', TRUE),
('admin-002', 'أحمد محمد السالم', '1234567890', 'Manager@123', 'admin', 'ahmed.salem@najran-health.gov.sa', '0501234567', 'مستشفى الملك خالد', 'الإدارة العامة', TRUE),
('news-manager-001', 'سارة أحمد الزهراني', '2234567890', 'News@123', 'staff', 'sara.alzahrani@najran-health.gov.sa', '0502234567', 'تجمع نجران الصحي', 'إدارة التواصل والإعلام', TRUE),
('media-manager-001', 'محمد علي القحطاني', '3234567890', 'Media@123', 'staff', 'mohammed.alqahtani@najran-health.gov.sa', '0503234567', 'تجمع نجران الصحي', 'الملف الإعلامي', TRUE),
('stats-manager-001', 'فاطمة سعد النعمي', '4234567890', 'Stats@123', 'staff', 'fatima.alnaami@najran-health.gov.sa', '0504234567', 'تجمع نجران الصحي', 'إدارة الإحصائيات والتقارير', TRUE),
('faq-manager-001', 'عبدالله محمد الشهري', '5234567890', 'FAQ@123', 'staff', 'abdullah.alshahri@najran-health.gov.sa', '0505234567', 'تجمع نجران الصحي', 'خدمة العملاء والدعم', TRUE),
('staff-001', 'فاطمة علي أحمد', '0987654321', 'Staff@123', 'staff', 'fatima.ali@najran-health.gov.sa', '0509876543', 'مستشفى الملك خالد', 'قسم الطوارئ', TRUE),
('doctor-001', 'د. خالد محمد العتيبي', '6543210987', 'Doctor@123', 'doctor', 'khalid.alotaibi@najran-health.gov.sa', '0512345678', 'مستشفى الملك خالد', 'قسم الباطنة', TRUE),
('dept-head-001', 'د. سلطان عبدالله الشمري', '7654321098', 'Head@123', 'department_head', 'sultan.alshammari@najran-health.gov.sa', '0523456789', 'مستشفى الملك خالد', 'قسم الطوارئ', TRUE),
('facility-manager-001', 'د. ناصر محمد القحطاني', '8765432109', 'Manager@123', 'manager', 'nasser.alqahtani@najran-health.gov.sa', '0534567890', 'مستشفى الملك خالد', 'إدارة المستشفى', TRUE),
('patient-001', 'محمد سعد القحطاني', '1122334455', 'Patient@123', 'patient', 'mohammed.alqahtani@gmail.com', '0551122334', NULL, NULL, TRUE);

-- إدراج الصلاحيات
INSERT INTO permissions (name, description_ar, description_en, category) VALUES
('full_system_access', 'الوصول الكامل للنظام', 'Full System Access', 'system'),
('user_management', 'إدارة المستخدمين', 'User Management', 'admin'),
('permissions_management', 'إدارة الصلاحيات', 'Permissions Management', 'admin'),
('facility_management', 'إدارة المنشآت', 'Facility Management', 'admin'),
('department_management', 'إدارة الأقسام', 'Department Management', 'admin'),
('service_management', 'إدارة الخدمات', 'Service Management', 'admin'),
('system_settings', 'إعدادات النظام', 'System Settings', 'admin'),
('homepage_settings', 'إعدادات الصفحة الرئيسية', 'Homepage Settings', 'admin'),
('reports_management', 'إدارة التقارير', 'Reports Management', 'reports'),
('live_display_management', 'إدارة العرض المباشر', 'Live Display Management', 'reports'),
('manage_hero_images', 'إدارة صور البطل', 'Manage Hero Images', 'content'),
('add_hero_images', 'إضافة صور البطل', 'Add Hero Images', 'content'),
('delete_hero_images', 'حذف صور البطل', 'Delete Hero Images', 'content'),
('edit_hero_images', 'تعديل صور البطل', 'Edit Hero Images', 'content'),
('manage_news', 'إدارة الأخبار', 'Manage News', 'content'),
('add_news', 'إضافة الأخبار', 'Add News', 'content'),
('edit_news', 'تعديل الأخبار', 'Edit News', 'content'),
('delete_news', 'حذف الأخبار', 'Delete News', 'content'),
('publish_news', 'نشر الأخبار', 'Publish News', 'content'),
('manage_achievements', 'إدارة الإنجازات', 'Manage Achievements', 'content'),
('add_achievements', 'إضافة الإنجازات', 'Add Achievements', 'content'),
('edit_achievements', 'تعديل الإنجازات', 'Edit Achievements', 'content'),
('delete_achievements', 'حذف الإنجازات', 'Delete Achievements', 'content'),
('manage_faqs', 'إدارة الأسئلة الشائعة', 'Manage FAQs', 'content'),
('add_faqs', 'إضافة الأسئلة الشائعة', 'Add FAQs', 'content'),
('edit_faqs', 'تعديل الأسئلة الشائعة', 'Edit FAQs', 'content'),
('delete_faqs', 'حذف الأسئلة الشائعة', 'Delete FAQs', 'content'),
('content_moderation', 'إشراف المحتوى', 'Content Moderation', 'content'),
('manage_statistics', 'إدارة الإحصائيات', 'Manage Statistics', 'reports'),
('view_statistics', 'عرض الإحصائيات', 'View Statistics', 'reports'),
('export_pdf', 'تصدير PDF', 'Export PDF', 'reports'),
('auto_response_bot', 'روبوت الرد التلقائي', 'Auto Response Bot', 'system'),
('manage_media_files', 'إدارة الملفات الإعلامية', 'Manage Media Files', 'content'),
('view_requests', 'عرض الطلبات', 'View Requests', 'operations'),
('process_requests', 'معالجة الطلبات', 'Process Requests', 'operations'),
('send_notifications', 'إرسال الإشعارات', 'Send Notifications', 'operations'),
('generate_reports', 'إنشاء التقارير', 'Generate Reports', 'reports'),
('manage_staff', 'إدارة الموظفين', 'Manage Staff', 'admin'),
('view_own_data', 'عرض البيانات الشخصية', 'View Own Data', 'patient'),
('book_appointments', 'حجز المواعيد', 'Book Appointments', 'patient'),
('view_medical_records', 'عرض السجلات الطبية', 'View Medical Records', 'medical'),
('request_services', 'طلب الخدمات', 'Request Services', 'patient'),
('approve_services', 'اعتماد الخدمات', 'Approve Services', 'operations'),
('service_availability', 'إتاحة الخدمات', 'Service Availability', 'operations'),
('view_all_requests', 'عرض جميع الطلبات', 'View All Requests', 'operations'),
('assign_requests', 'إسناد الطلبات', 'Assign Requests', 'operations'),
('escalate_requests', 'تصعيد الطلبات', 'Escalate Requests', 'operations'),
('provide_consultations', 'تقديم الاستشارات', 'Provide Consultations', 'medical'),
('doctor_availability', 'إتاحة الطبيب', 'Doctor Availability', 'medical'),
('system_monitoring', 'مراقبة النظام', 'System Monitoring', 'system'),
('audit_logs', 'سجلات التدقيق', 'Audit Logs', 'system'),
('advanced_settings', 'الإعدادات المتقدمة', 'Advanced Settings', 'system'),
('database_management', 'إدارة قاعدة البيانات', 'Database Management', 'system'),
('security_center', 'مركز الأمان', 'Security Center', 'system');

-- إدراج صلاحيات المستخدمين
-- صلاحيات مدير النظام الرئيسي (جميع الصلاحيات)
INSERT INTO user_permissions (user_id, permission_name, granted_by)
SELECT 'admin-001', name, 'admin-001' FROM permissions;

-- صلاحيات المسؤول العام
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('admin-002', 'view_requests', 'admin-001'),
('admin-002', 'process_requests', 'admin-001'),
('admin-002', 'send_notifications', 'admin-001'),
('admin-002', 'generate_reports', 'admin-001'),
('admin-002', 'manage_staff', 'admin-001'),
('admin-002', 'facility_management', 'admin-001'),
('admin-002', 'department_management', 'admin-001'),
('admin-002', 'service_management', 'admin-001'),
('admin-002', 'manage_hero_images', 'admin-001'),
('admin-002', 'add_hero_images', 'admin-001'),
('admin-002', 'delete_hero_images', 'admin-001'),
('admin-002', 'edit_hero_images', 'admin-001'),
('admin-002', 'manage_news', 'admin-001'),
('admin-002', 'add_news', 'admin-001'),
('admin-002', 'edit_news', 'admin-001'),
('admin-002', 'delete_news', 'admin-001'),
('admin-002', 'publish_news', 'admin-001'),
('admin-002', 'manage_achievements', 'admin-001'),
('admin-002', 'add_achievements', 'admin-001'),
('admin-002', 'edit_achievements', 'admin-001'),
('admin-002', 'delete_achievements', 'admin-001'),
('admin-002', 'manage_statistics', 'admin-001'),
('admin-002', 'view_statistics', 'admin-001'),
('admin-002', 'export_pdf', 'admin-001'),
('admin-002', 'approve_services', 'admin-001'),
('admin-002', 'service_availability', 'admin-001'),
('admin-002', 'view_all_requests', 'admin-001'),
('admin-002', 'assign_requests', 'admin-001'),
('admin-002', 'live_display_management', 'admin-001');

-- صلاحيات مسؤول الأخبار
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('news-manager-001', 'manage_news', 'admin-001'),
('news-manager-001', 'add_news', 'admin-001'),
('news-manager-001', 'edit_news', 'admin-001'),
('news-manager-001', 'delete_news', 'admin-001'),
('news-manager-001', 'publish_news', 'admin-001'),
('news-manager-001', 'manage_media_files', 'admin-001'),
('news-manager-001', 'content_moderation', 'admin-001');

-- صلاحيات مسؤول الملف الإعلامي
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('media-manager-001', 'manage_hero_images', 'admin-001'),
('media-manager-001', 'add_hero_images', 'admin-001'),
('media-manager-001', 'delete_hero_images', 'admin-001'),
('media-manager-001', 'edit_hero_images', 'admin-001'),
('media-manager-001', 'manage_achievements', 'admin-001'),
('media-manager-001', 'add_achievements', 'admin-001'),
('media-manager-001', 'edit_achievements', 'admin-001'),
('media-manager-001', 'delete_achievements', 'admin-001'),
('media-manager-001', 'manage_media_files', 'admin-001');

-- صلاحيات مسؤول الإحصائيات
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('stats-manager-001', 'manage_statistics', 'admin-001'),
('stats-manager-001', 'view_statistics', 'admin-001'),
('stats-manager-001', 'generate_reports', 'admin-001'),
('stats-manager-001', 'export_pdf', 'admin-001');

-- صلاحيات مسؤول الأسئلة الشائعة
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('faq-manager-001', 'manage_faqs', 'admin-001'),
('faq-manager-001', 'add_faqs', 'admin-001'),
('faq-manager-001', 'edit_faqs', 'admin-001'),
('faq-manager-001', 'delete_faqs', 'admin-001'),
('faq-manager-001', 'auto_response_bot', 'admin-001');

-- صلاحيات الموظف
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('staff-001', 'view_requests', 'admin-001'),
('staff-001', 'process_requests', 'admin-001'),
('staff-001', 'send_notifications', 'admin-001'),
('staff-001', 'live_display_management', 'admin-001');

-- صلاحيات الطبيب
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('doctor-001', 'view_requests', 'admin-001'),
('doctor-001', 'process_requests', 'admin-001'),
('doctor-001', 'send_notifications', 'admin-001'),
('doctor-001', 'view_medical_records', 'admin-001'),
('doctor-001', 'provide_consultations', 'admin-001'),
('doctor-001', 'doctor_availability', 'admin-001');

-- صلاحيات رئيس القسم
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('dept-head-001', 'view_requests', 'admin-001'),
('dept-head-001', 'process_requests', 'admin-001'),
('dept-head-001', 'send_notifications', 'admin-001'),
('dept-head-001', 'manage_staff', 'admin-001'),
('dept-head-001', 'view_statistics', 'admin-001'),
('dept-head-001', 'generate_reports', 'admin-001'),
('dept-head-001', 'assign_requests', 'admin-001'),
('dept-head-001', 'escalate_requests', 'admin-001'),
('dept-head-001', 'live_display_management', 'admin-001');

-- صلاحيات مدير المنشأة
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

-- صلاحيات المريض
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('patient-001', 'view_own_data', 'admin-001'),
('patient-001', 'book_appointments', 'admin-001'),
('patient-001', 'view_medical_records', 'admin-001'),
('patient-001', 'request_services', 'admin-001');

-- إدراج المنشآت
INSERT INTO facilities (name_ar, name_en, type, address, phone, email, manager_id) VALUES
('مستشفى الملك خالد', 'King Khalid Hospital', 'hospital', 'نجران، المملكة العربية السعودية', '0175422222', 'kkh@najran-health.gov.sa', 'facility-manager-001'),
('مركز الأمير سلطان لأمراض القلب', 'Prince Sultan Center for Heart Diseases', 'specialized_center', 'نجران، المملكة العربية السعودية', '0175433333', 'psc@najran-health.gov.sa', NULL),
('مركز الأمير سلطان لأمراض الكلى', 'Prince Sultan Center for Kidney Diseases', 'specialized_center', 'نجران، المملكة العربية السعودية', '0175444444', 'pskc@najran-health.gov.sa', NULL),
('مستشفى نجران البلد', 'Najran City Hospital', 'hospital', 'نجران البلد، المملكة العربية السعودية', '0175455555', 'nch@najran-health.gov.sa', NULL);

-- إدراج المراكز الصحية (مع ربطها بالمستشفى الأم)
INSERT INTO facilities (name_ar, name_en, type, parent_id, address, phone) VALUES
('مركز صحي الخالدية', 'Khalidiya Health Center', 'health_center', 1, 'حي الخالدية، نجران', '0175466666'),
('مركز صحي الضيافة', 'Diyafa Health Center', 'health_center', 1, 'حي الضيافة، نجران', '0175477777'),
('مركز صحي الأمير مشعل', 'Prince Mishal Health Center', 'health_center', 1, 'حي الأمير مشعل، نجران', '0175488888'),
('مركز صحي حي نهوقة', 'Nahoqa District Health Center', 'health_center', 4, 'حي نهوقة، نجران البلد', '0175499999'),
('مركز صحي البلد', 'City Health Center', 'health_center', 4, 'وسط البلد، نجران', '0175400000');

-- إدراج الأقسام
INSERT INTO departments (name_ar, name_en, facility_id, description_ar, description_en) VALUES
('قسم الطوارئ', 'Emergency Department', 1, 'قسم الطوارئ والحالات الحرجة', 'Emergency and critical care department'),
('قسم الباطنة', 'Internal Medicine', 1, 'قسم الأمراض الباطنة', 'Internal medicine department'),
('قسم الجراحة', 'Surgery Department', 1, 'قسم الجراحة العامة والمتخصصة', 'General and specialized surgery department'),
('قسم النساء والولادة', 'Obstetrics & Gynecology', 4, 'قسم أمراض النساء والولادة', 'Obstetrics and gynecology department'),
('قسم الأطفال', 'Pediatrics', 4, 'قسم طب الأطفال', 'Pediatrics department'),
('قسم العيون', 'Ophthalmology', 1, 'قسم طب وجراحة العيون', 'Ophthalmology department'),
('قسم الأنف والأذن والحنجرة', 'ENT', 1, 'قسم الأنف والأذن والحنجرة', 'Ear, Nose, and Throat department'),
('قسم الأشعة', 'Radiology', 1, 'قسم الأشعة والتصوير الطبي', 'Radiology and medical imaging department'),
('قسم المختبر', 'Laboratory', 1, 'قسم المختبر والتحاليل الطبية', 'Laboratory and medical tests department'),
('قسم العلاج الطبيعي', 'Physical Therapy', 1, 'قسم العلاج الطبيعي وإعادة التأهيل', 'Physical therapy and rehabilitation department');

-- إدراج الخدمات
INSERT INTO services (name_ar, name_en, description_ar, description_en, department_id, estimated_duration, is_approved, approved_by, is_active) VALUES
('فحص شامل', 'Comprehensive Examination', 'فحص طبي شامل للمريض', 'Comprehensive medical examination', 1, 30, TRUE, 'admin-001', TRUE),
('تخطيط القلب', 'ECG', 'تخطيط كهربائية القلب', 'Electrocardiogram', 2, 15, TRUE, 'admin-001', TRUE),
('عملية جراحية', 'Surgical Operation', 'عملية جراحية عامة', 'General surgical operation', 3, 120, TRUE, 'admin-001', TRUE),
('فحص الحمل', 'Pregnancy Check', 'فحص دوري للحامل', 'Routine pregnancy examination', 4, 20, TRUE, 'admin-001', TRUE),
('فحص الأطفال', 'Pediatric Check', 'فحص طبي للأطفال', 'Pediatric medical examination', 5, 25, TRUE, 'admin-001', TRUE),
('استشارة طبية', 'Medical Consultation', 'استشارة طبية مع طبيب متخصص', 'Medical consultation with a specialist', 2, 30, TRUE, 'admin-001', TRUE),
('فحص العيون', 'Eye Examination', 'فحص شامل للعيون', 'Comprehensive eye examination', 6, 20, TRUE, 'admin-001', TRUE),
('فحص السمع', 'Hearing Test', 'فحص السمع والأذن', 'Hearing and ear examination', 7, 25, TRUE, 'admin-001', TRUE),
('أشعة سينية', 'X-Ray', 'تصوير بالأشعة السينية', 'X-Ray imaging', 8, 15, TRUE, 'admin-001', TRUE),
('تحليل دم شامل', 'Complete Blood Count', 'تحليل شامل لمكونات الدم', 'Comprehensive blood analysis', 9, 10, TRUE, 'admin-001', TRUE),
('جلسة علاج طبيعي', 'Physical Therapy Session', 'جلسة علاج طبيعي وإعادة تأهيل', 'Physical therapy and rehabilitation session', 10, 45, TRUE, 'admin-001', TRUE);

-- إدراج إتاحة الأطباء
INSERT INTO doctor_availability (doctor_id, is_available, available_from, available_to, available_days) VALUES
('doctor-001', TRUE, '08:00', '16:00', '1,2,3,4,5');

-- إدراج طلبات وهمية
INSERT INTO requests (request_number, user_id, service_id, facility_id, department_id, status, priority, notes, queue_number, requested_date, requested_time) VALUES
('REQ-2025-001', 'patient-001', 1, 1, 1, 'pending', 'medium', 'فحص دوري', 5, '2025-01-25', '09:00'),
('REQ-2025-002', 'patient-001', 2, 1, 2, 'in_progress', 'high', 'ألم في الصدر', 3, '2025-01-24', '10:30'),
('REQ-2025-003', 'patient-001', 5, 4, 5, 'completed', 'low', 'فحص طفل', 7, '2025-01-23', '14:00');

-- إدراج الأخبار
INSERT INTO news (title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en, category, author_id, is_published, publish_date) VALUES
('افتتاح وحدة جديدة للعناية المركزة', 'Opening of New Intensive Care Unit', 'تم افتتاح وحدة جديدة للعناية المركزة مجهزة بأحدث الأجهزة الطبية', 'A new intensive care unit equipped with the latest medical devices has been opened', 'محتوى الخبر الكامل...', 'Full news content...', 'medical', 'news-manager-001', TRUE, '2025-01-20 10:00:00'),
('تدشين خدمات الطب النووي', 'Launch of Nuclear Medicine Services', 'بدء تقديم خدمات الطب النووي المتطورة للمرضى', 'Advanced nuclear medicine services have begun for patients', 'محتوى الخبر الكامل...', 'Full news content...', 'medical', 'news-manager-001', TRUE, '2025-01-18 12:00:00');

-- إدراج صور البطل
INSERT INTO hero_images (title_ar, title_en, image_url, display_order, uploaded_by) VALUES
('صورة المستشفى الرئيسية', 'Main Hospital Image', '/3bdb653c-3f39-43eb-943f-22da6e80b8f7.jfif', 1, 'media-manager-001'),
('فريق طبي متخصص', 'Specialized Medical Team', '/758.jpeg', 2, 'media-manager-001'),
('تقنيات طبية متطورة', 'Advanced Medical Technologies', '/984.jfif', 3, 'media-manager-001');

-- إدراج الإنجازات
INSERT INTO achievements (title_ar, title_en, description_ar, description_en, year, icon, color, created_by) VALUES
('جائزة التميز في الخدمات الصحية', 'Excellence Award in Health Services', 'حصل التجمع على جائزة التميز في تقديم الخدمات الصحية الرقمية', 'The cluster received the excellence award for digital health services', '2024', 'award', 'from-yellow-500 to-yellow-600', 'media-manager-001'),
('أفضل منصة صحية رقمية', 'Best Digital Health Platform', 'تم اختيار المنصة كأفضل منصة صحية رقمية على مستوى المملكة', 'The platform was selected as the best digital health platform in the Kingdom', '2024', 'trophy', 'from-blue-500 to-blue-600', 'media-manager-001');

-- إدراج الأسئلة الشائعة
INSERT INTO faqs (question_ar, question_en, answer_ar, answer_en, category, display_order, auto_response, created_by) VALUES
('كيف يمكنني حجز موعد؟', 'How can I book an appointment?', 'يمكنك حجز موعد من خلال المنصة الرقمية أو الاتصال بالرقم المخصص', 'You can book an appointment through the digital platform or by calling the dedicated number', 'appointments', 1, TRUE, 'faq-manager-001'),
('ما هي ساعات العمل؟', 'What are the working hours?', 'نعمل من الأحد إلى الخميس من 8:00 صباحاً حتى 4:00 مساءً', 'We work from Sunday to Thursday from 8:00 AM to 4:00 PM', 'general', 2, TRUE, 'faq-manager-001'),
('كيف أحصل على نتائج الفحوصات؟', 'How do I get test results?', 'يمكنك الحصول على النتائج من خلال المنصة الرقمية أو زيارة المختبر', 'You can get results through the digital platform or by visiting the laboratory', 'results', 3, TRUE, 'faq-manager-001');

-- إدراج إشعارات وهمية
INSERT INTO notifications (user_id, title_ar, title_en, message_ar, message_en, type) VALUES
('patient-001', 'تأكيد موعد', 'Appointment Confirmation', 'تم تأكيد موعدكم للفحص الطبي', 'Your medical examination appointment has been confirmed', 'success'),
('patient-001', 'نتائج جاهزة', 'Results Ready', 'نتائج تحاليلكم الطبية أصبحت جاهزة', 'Your medical test results are ready', 'info'),
('staff-001', 'طلب جديد', 'New Request', 'يوجد طلب جديد يتطلب المراجعة', 'There is a new request that requires review', 'warning');

-- إدراج بيانات سجل النشاطات
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details) VALUES
('admin-001', 'login', 'تسجيل دخول مدير النظام', 'System admin login', '192.168.1.100', '{"browser": "Chrome", "os": "Windows 10", "device": "Desktop", "location": "Najran, Saudi Arabia"}'),
('patient-001', 'book_appointment', 'حجز موعد جديد', 'New appointment booking', '192.168.1.101', '{"browser": "Safari", "os": "iOS 16", "device": "Mobile", "location": "Najran, Saudi Arabia", "appointmentId": "APT-2025-001", "appointmentDate": "2025-01-25T14:30:00", "department": "قسم الباطنة"}'),
('staff-001', 'process_request', 'معالجة طلب خدمة', 'Service request processing', '192.168.1.102', '{"browser": "Chrome", "os": "macOS", "device": "Desktop", "location": "Najran, Saudi Arabia", "requestId": "REQ-2025-001", "requestType": "فحص مختبري", "action": "approve", "notes": "تمت الموافقة على الطلب"}'),
('news-manager-001', 'add_news', 'إضافة خبر جديد', 'New news article added', '192.168.1.103', '{"browser": "Chrome", "os": "Windows 10", "device": "Desktop", "location": "Najran, Saudi Arabia", "newsId": "NEWS-2025-001", "newsTitle": "افتتاح وحدة جديدة للعناية المركزة", "action": "create"}');

-- إنشاء stored procedures مفيدة
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_id VARCHAR(50))
RETURNS TABLE (
  pending_requests BIGINT,
  in_progress_requests BIGINT,
  completed_requests BIGINT,
  total_requests BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(CASE WHEN status = 'pending' THEN 1 END)::BIGINT as pending_requests,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END)::BIGINT as in_progress_requests,
    COUNT(CASE WHEN status = 'completed' THEN 1 END)::BIGINT as completed_requests,
    COUNT(*)::BIGINT as total_requests
  FROM requests 
  WHERE user_id = $1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_facility_stats(facility_id INTEGER)
RETURNS TABLE (
  total_patients BIGINT,
  total_requests BIGINT,
  avg_completion_time NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT r.user_id)::BIGINT as total_patients,
    COUNT(r.id)::BIGINT as total_requests,
    AVG(CASE WHEN r.status = 'completed' THEN 
      EXTRACT(EPOCH FROM (r.completed_at - r.created_at))/60 
    END)::NUMERIC as avg_completion_time
  FROM requests r
  WHERE r.facility_id = $1
  AND r.created_at >= NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- تعليقات ختامية
/*
  قاعدة البيانات تحتوي على:
  1. جداول المستخدمين والصلاحيات
  2. جداول المنشآت والأقسام والخدمات
  3. جداول الطلبات والإشعارات
  4. جداول المحتوى (الأخبار، صور البطل، الإنجازات، الأسئلة الشائعة)
  5. جداول سجل النشاطات
  6. جداول إضافية (إتاحة الأطباء، إسناد الطلبات، بلاغات الطلبات)
  7. فهارس لتحسين الأداء
  8. Views و Functions مفيدة
  9. بيانات وهمية للاختبار
*/