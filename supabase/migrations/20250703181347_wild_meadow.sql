/*
  # قاعدة بيانات تجمع نجران الصحي
  
  هذا الملف يحتوي على جميع الجداول والوظائف والبيانات الأولية اللازمة لنظام تجمع نجران الصحي.
  يمكن استيراد هذا الملف مباشرة لإنشاء قاعدة البيانات كاملة.
  
  المحتويات:
  1. إنشاء الجداول الأساسية
  2. إنشاء العلاقات بين الجداول
  3. إنشاء الفهارس لتحسين الأداء
  4. إنشاء الوظائف والإجراءات المخزنة
  5. إدراج البيانات الأولية
  6. إنشاء المشاهدات (Views)
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
  contract_type VARCHAR(20) CHECK (contract_type IN ('permanent', 'temporary')),
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

-- جدول صور الأطباء
CREATE TABLE IF NOT EXISTS doctor_images (
  id SERIAL PRIMARY KEY,
  doctor_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  uploaded_by VARCHAR(50) REFERENCES users(id),
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

-- جدول تقييمات الخدمات
CREATE TABLE IF NOT EXISTS service_ratings (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  request_id INTEGER REFERENCES requests(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
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

-- جدول العناصر المخفية
CREATE TABLE IF NOT EXISTS hidden_elements (
  id SERIAL PRIMARY KEY,
  element_type VARCHAR(50) NOT NULL, -- 'service', 'department', 'user', 'facility', etc.
  element_id VARCHAR(100) NOT NULL,
  element_name VARCHAR(255), -- اسم العنصر للعرض
  hidden_by VARCHAR(50) NOT NULL REFERENCES users(id),
  hidden_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_hidden BOOLEAN DEFAULT TRUE,
  notes TEXT,
  UNIQUE(element_type, element_id)
);

-- إنشاء الفهارس لتحسين الأداء
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
CREATE INDEX IF NOT EXISTS idx_hidden_elements_type_id ON hidden_elements(element_type, element_id);
CREATE INDEX IF NOT EXISTS idx_hidden_elements_is_hidden ON hidden_elements(is_hidden);
CREATE INDEX IF NOT EXISTS idx_doctor_images_doctor_id ON doctor_images(doctor_id);
CREATE INDEX IF NOT EXISTS idx_service_ratings_user_id ON service_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_service_ratings_request_id ON service_ratings(request_id);

-- إنشاء الوظائف

-- وظيفة للتحقق مما إذا كان العنصر مخفيًا
CREATE OR REPLACE FUNCTION is_element_hidden(element_type VARCHAR, element_id VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM hidden_elements 
    WHERE element_type = $1 
    AND element_id = $2 
    AND is_hidden = TRUE
  );
END;
$$ LANGUAGE plpgsql;

-- وظيفة لإخفاء عنصر
CREATE OR REPLACE FUNCTION hide_element(element_type VARCHAR, element_id VARCHAR, element_name VARCHAR, user_id VARCHAR, notes TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO hidden_elements (element_type, element_id, element_name, hidden_by, notes)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (element_type, element_id) 
  DO UPDATE SET is_hidden = TRUE, element_name = $3, hidden_by = $4, hidden_at = CURRENT_TIMESTAMP, notes = $5;
  
  -- إضافة سجل نشاط
  INSERT INTO activity_logs (user_id, action, description_ar, description_en, details)
  VALUES (
    $4, 
    'hide_element', 
    'إخفاء عنصر: ' || $3, 
    'Hide element: ' || $3, 
    jsonb_build_object('element_type', $1, 'element_id', $2, 'element_name', $3)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- وظيفة لإلغاء إخفاء عنصر
CREATE OR REPLACE FUNCTION unhide_element(element_type VARCHAR, element_id VARCHAR, user_id VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  element_name VARCHAR;
BEGIN
  -- الحصول على اسم العنصر قبل التحديث
  SELECT he.element_name INTO element_name
  FROM hidden_elements he
  WHERE he.element_type = $1 AND he.element_id = $2;

  -- تحديث حالة الإخفاء
  UPDATE hidden_elements 
  SET is_hidden = FALSE 
  WHERE element_type = $1 AND element_id = $2;
  
  -- إضافة سجل نشاط
  INSERT INTO activity_logs (user_id, action, description_ar, description_en, details)
  VALUES (
    $3, 
    'unhide_element', 
    'إظهار عنصر: ' || element_name, 
    'Unhide element: ' || element_name, 
    jsonb_build_object('element_type', $1, 'element_id', $2, 'element_name', element_name)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- وظيفة للحصول على جميع العناصر المخفية
CREATE OR REPLACE FUNCTION get_hidden_elements()
RETURNS TABLE (
  id INTEGER,
  element_type VARCHAR,
  element_id VARCHAR,
  element_name VARCHAR,
  hidden_by VARCHAR,
  hidden_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    he.id,
    he.element_type,
    he.element_id,
    he.element_name,
    he.hidden_by,
    he.hidden_at,
    he.notes
  FROM hidden_elements he
  WHERE he.is_hidden = TRUE
  ORDER BY he.hidden_at DESC;
END;
$$ LANGUAGE plpgsql;

-- وظيفة للتحقق من صلاحية الوصول للطلب
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

-- وظيفة لحساب متوسط التقييمات
CREATE OR REPLACE FUNCTION get_average_rating()
RETURNS NUMERIC AS $$
BEGIN
  RETURN (SELECT AVG(rating)::NUMERIC(3,2) FROM service_ratings);
END;
$$ LANGUAGE plpgsql;

-- وظيفة لحساب متوسط التقييمات لطلب معين
CREATE OR REPLACE FUNCTION get_request_average_rating(request_id INTEGER)
RETURNS NUMERIC AS $$
BEGIN
  RETURN (SELECT AVG(rating)::NUMERIC(3,2) FROM service_ratings WHERE request_id = $1);
END;
$$ LANGUAGE plpgsql;

-- وظيفة للحصول على إحصائيات لوحة التحكم للمستخدم
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

-- وظيفة للحصول على إحصائيات المنشأة
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

-- إنشاء المشاهدات (Views)

-- مشاهدة صلاحيات المستخدمين
CREATE OR REPLACE VIEW user_permissions_view AS
SELECT 
  u.id,
  u.name,
  u.role,
  ARRAY_AGG(up.permission_name) as permissions
FROM users u
LEFT JOIN user_permissions up ON u.id = up.user_id
GROUP BY u.id, u.name, u.role;

-- مشاهدة الطلبات النشطة
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
INSERT INTO users (id, name, national_id, password, role, email, mobile, facility, department, contract_type, is_active) VALUES
('admin-001', 'مدير النظام الرئيسي', '1111111111', 'Admin@2025', 'system_admin', 'system.admin@najran-health.gov.sa', '0545048999', 'تجمع نجران الصحي', 'إدارة تقنية المعلومات', NULL, TRUE),
('admin-002', 'أحمد محمد السالم', '1234567890', 'Manager@123', 'admin', 'ahmed.salem@najran-health.gov.sa', '0501234567', 'مستشفى الملك خالد', 'الإدارة العامة', NULL, TRUE),
('news-manager-001', 'سارة أحمد الزهراني', '2234567890', 'News@123', 'staff', 'sara.alzahrani@najran-health.gov.sa', '0502234567', 'تجمع نجران الصحي', 'إدارة التواصل والإعلام', NULL, TRUE),
('media-manager-001', 'محمد علي القحطاني', '3234567890', 'Media@123', 'staff', 'mohammed.alqahtani@najran-health.gov.sa', '0503234567', 'تجمع نجران الصحي', 'الملف الإعلامي', NULL, TRUE),
('stats-manager-001', 'فاطمة سعد النعمي', '4234567890', 'Stats@123', 'staff', 'fatima.alnaami@najran-health.gov.sa', '0504234567', 'تجمع نجران الصحي', 'إدارة الإحصائيات والتقارير', NULL, TRUE),
('faq-manager-001', 'عبدالله محمد الشهري', '5234567890', 'FAQ@123', 'staff', 'abdullah.alshahri@najran-health.gov.sa', '0505234567', 'تجمع نجران الصحي', 'خدمة العملاء والدعم', NULL, TRUE),
('staff-001', 'فاطمة علي أحمد', '0987654321', 'Staff@123', 'staff', 'fatima.ali@najran-health.gov.sa', '0509876543', 'مستشفى الملك خالد', 'قسم الطوارئ', NULL, TRUE),
('doctor-001', 'د. خالد محمد العتيبي', '6543210987', 'Doctor@123', 'doctor', 'khalid.alotaibi@najran-health.gov.sa', '0512345678', 'مستشفى الملك خالد', 'قسم الباطنة', 'temporary', TRUE),
('doctor-002', 'د. سارة محمد العتيبي', '9876543210', 'Doctor@123', 'doctor', 'sarah.alotaibi@najran-health.gov.sa', '0512345679', 'مستشفى الملك خالد', 'قسم النساء والولادة', 'permanent', TRUE),
('doctor-003', 'د. عبدالله سعد الشهري', '0123456789', 'Doctor@123', 'doctor', 'abdullah.alshahri@najran-health.gov.sa', '0512345680', 'مستشفى نجران البلد', 'قسم الأطفال', 'temporary', TRUE),
('dept-head-001', 'د. سلطان عبدالله الشمري', '7654321098', 'Head@123', 'department_head', 'sultan.alshammari@najran-health.gov.sa', '0523456789', 'مستشفى الملك خالد', 'قسم الطوارئ', NULL, TRUE),
('facility-manager-001', 'د. ناصر محمد القحطاني', '8765432109', 'Manager@123', 'manager', 'nasser.alqahtani@najran-health.gov.sa', '0534567890', 'مستشفى الملك خالد', 'إدارة المستشفى', NULL, TRUE),
('patient-001', 'محمد سعد القحطاني', '1122334455', 'Patient@123', 'patient', 'mohammed.alqahtani@gmail.com', '0551122334', NULL, NULL, NULL, TRUE);

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
('security_center', 'مركز الأمان', 'Security Center', 'system'),
('hide_elements', 'إخفاء العناصر', 'Hide Elements', 'system'),
('view_ratings', 'عرض تقييمات الخدمات', 'View Service Ratings', 'reports'),
('manage_ratings', 'إدارة تقييمات الخدمات', 'Manage Service Ratings', 'reports'),
('request_new_service', 'طلب خدمة جديدة', 'Request New Service', 'operations'),
('patient_request_service', 'طلب خدمة للمرضى فقط', 'Service Request for Patients Only', 'patient'),
('manage_doctors', 'إدارة الأطباء', 'Manage Doctors', 'admin'),
('add_auto_response', 'إضافة رد تلقائي', 'Add Auto Response', 'content'),
('edit_auto_response', 'تعديل رد تلقائي', 'Edit Auto Response', 'content'),
('delete_auto_response', 'حذف رد تلقائي', 'Delete Auto Response', 'content');

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
('admin-002', 'manage_faqs', 'admin-001'),
('admin-002', 'add_faqs', 'admin-001'),
('admin-002', 'edit_faqs', 'admin-001'),
('admin-002', 'delete_faqs', 'admin-001'),
('admin-002', 'manage_statistics', 'admin-001'),
('admin-002', 'view_statistics', 'admin-001'),
('admin-002', 'export_pdf', 'admin-001'),
('admin-002', 'approve_services', 'admin-001'),
('admin-002', 'service_availability', 'admin-001'),
('admin-002', 'view_all_requests', 'admin-001'),
('admin-002', 'assign_requests', 'admin-001'),
('admin-002', 'live_display_management', 'admin-001'),
('admin-002', 'view_ratings', 'admin-001'),
('admin-002', 'manage_ratings', 'admin-001'),
('admin-002', 'manage_doctors', 'admin-001'),
('admin-002', 'add_auto_response', 'admin-001'),
('admin-002', 'edit_auto_response', 'admin-001'),
('admin-002', 'delete_auto_response', 'admin-001');

-- صلاحيات مسؤول الأخبار
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('news-manager-001', 'manage_news', 'admin-001'),
('news-manager-001', 'add_news', 'admin-001'),
('news-manager-001', 'edit_news', 'admin-001'),
('news-manager-001', 'delete_news', 'admin-001'),
('news-manager-001', 'publish_news', 'admin-001'),
('news-manager-001', 'manage_media_files', 'admin-001'),
('news-manager-001', 'content_moderation', 'admin-001'),
('news-manager-001', 'live_display_management', 'admin-001'),
('news-manager-001', 'view_ratings', 'admin-001'),
('news-manager-001', 'manage_ratings', 'admin-001');

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
('media-manager-001', 'manage_media_files', 'admin-001'),
('media-manager-001', 'live_display_management', 'admin-001');

-- صلاحيات مسؤول الإحصائيات
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('stats-manager-001', 'manage_statistics', 'admin-001'),
('stats-manager-001', 'view_statistics', 'admin-001'),
('stats-manager-001', 'generate_reports', 'admin-001'),
('stats-manager-001', 'export_pdf', 'admin-001'),
('stats-manager-001', 'live_display_management', 'admin-001');

-- صلاحيات مسؤول الأسئلة الشائعة
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('faq-manager-001', 'manage_faqs', 'admin-001'),
('faq-manager-001', 'add_faqs', 'admin-001'),
('faq-manager-001', 'edit_faqs', 'admin-001'),
('faq-manager-001', 'delete_faqs', 'admin-001'),
('faq-manager-001', 'manage_media_files', 'admin-001'),
('faq-manager-001', 'auto_response_bot', 'admin-001'),
('faq-manager-001', 'live_display_management', 'admin-001'),
('faq-manager-001', 'add_auto_response', 'admin-001'),
('faq-manager-001', 'edit_auto_response', 'admin-001'),
('faq-manager-001', 'delete_auto_response', 'admin-001');

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
('doctor-001', 'doctor_availability', 'admin-001'),
('doctor-001', 'live_display_management', 'admin-001'),
('doctor-001', 'view_medical_records', 'admin-001');

-- صلاحيات الطبيب الثاني
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('doctor-002', 'view_requests', 'admin-001'),
('doctor-002', 'process_requests', 'admin-001'),
('doctor-002', 'send_notifications', 'admin-001'),
('doctor-002', 'view_medical_records', 'admin-001'),
('doctor-002', 'provide_consultations', 'admin-001'),
('doctor-002', 'doctor_availability', 'admin-001');

-- صلاحيات الطبيب الثالث
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('doctor-003', 'view_requests', 'admin-001'),
('doctor-003', 'process_requests', 'admin-001'),
('doctor-003', 'send_notifications', 'admin-001'),
('doctor-003', 'view_medical_records', 'admin-001'),
('doctor-003', 'provide_consultations', 'admin-001'),
('doctor-003', 'doctor_availability', 'admin-001');

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
('dept-head-001', 'live_display_management', 'admin-001'),
('dept-head-001', 'view_medical_records', 'admin-001'),
('dept-head-001', 'manage_doctors', 'admin-001');

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
('facility-manager-001', 'live_display_management', 'admin-001'),
('facility-manager-001', 'database_management', 'admin-001'),
('facility-manager-001', 'view_ratings', 'admin-001'),
('facility-manager-001', 'manage_ratings', 'admin-001'),
('facility-manager-001', 'manage_doctors', 'admin-001'),
('facility-manager-001', 'add_auto_response', 'admin-001'),
('facility-manager-001', 'edit_auto_response', 'admin-001'),
('facility-manager-001', 'delete_auto_response', 'admin-001');

-- صلاحيات المريض
INSERT INTO user_permissions (user_id, permission_name, granted_by) VALUES
('patient-001', 'view_own_data', 'admin-001'),
('patient-001', 'book_appointments', 'admin-001'),
('patient-001', 'view_medical_records', 'admin-001'),
('patient-001', 'request_services', 'admin-001'),
('patient-001', 'patient_request_service', 'admin-001');

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
('مركز صحي بئر عسكر', 'Bir Askar Health Center', 'health_center', 1, 'بئر عسكر، نجران', '0175499999'),
('مركز صحي حي الفهد الشمالي', 'North Fahd District Health Center', 'health_center', 1, 'حي الفهد الشمالي، نجران', '0175400000'),
('مركز صحي الكنتوب', 'Kantob Health Center', 'health_center', 1, 'الكنتوب، نجران', '0175411111'),
('مركز صحي الفيصلية', 'Faisaliya Health Center', 'health_center', 1, 'حي الفيصلية، نجران', '0175422222'),
('مركز صحي عاكفة', 'Akifa Health Center', 'health_center', 1, 'عاكفة، نجران', '0175433333'),
('مركز صحي الضباط', 'Officers Health Center', 'health_center', 1, 'حي الضباط، نجران', '0175444444'),
('مركز السكري والغدد الصماء', 'Diabetes & Endocrinology Center', 'health_center', 1, 'نجران', '0175455555'),
('مركز الأورام', 'Oncology Center', 'health_center', 1, 'نجران', '0175466666'),
('مركز حي نهوقة', 'Nahoqa District Center', 'health_center', 4, 'حي نهوقة، نجران البلد', '0175477777'),
('مركز صحي البلد', 'City Health Center', 'health_center', 4, 'وسط البلد، نجران', '0175488888'),
('مركز صحي الموفجة', 'Mowfaja Health Center', 'health_center', 4, 'الموفجة، نجران', '0175499999'),
('مركز صحي الشبهان', 'Shabhan Health Center', 'health_center', 4, 'الشبهان، نجران', '0175400000'),
('مركز صحي أبا السعود', 'Aba Alsaoud Health Center', 'health_center', 4, 'أبا السعود، نجران', '0175411111'),
('مركز صحي الحضن', 'Hadn Health Center', 'health_center', 4, 'الحضن، نجران', '0175422222'),
('مركز صحي المراطة', 'Marata Health Center', 'health_center', 4, 'المراطة، نجران', '0175433333'),
('مركز صحي دحضة', 'Dahda Health Center', 'health_center', 4, 'دحضة، نجران', '0175444444'),
('مركز صحي الجربة', 'Jarba Health Center', 'health_center', 4, 'الجربة، نجران', '0175455555'),
('مركز صحي الصفا', 'Safa Health Center', 'health_center', 4, 'الصفا، نجران', '0175466666'),
('مركز صحي القابل', 'Qabel Health Center', 'health_center', 4, 'القابل، نجران', '0175477777'),
('مركز صحي شعب رير', 'Shab Rir Health Center', 'health_center', 4, 'شعب رير، نجران', '0175488888');

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
('doctor-001', TRUE, '08:00', '16:00', '1,2,3,4,5'),
('doctor-002', TRUE, '09:00', '17:00', '1,2,3,4,5'),
('doctor-003', TRUE, '10:00', '18:00', '1,2,3,4,5');

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

-- إدراج بيانات تقييمات الخدمات
INSERT INTO service_ratings (user_id, request_id, rating, feedback) VALUES
('patient-001', 3, 5, 'خدمة ممتازة وسريعة'),
('patient-001', 2, 4, 'خدمة جيدة ولكن كان هناك بعض التأخير');

-- إدراج بيانات سجل النشاطات
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details) VALUES
('admin-001', 'login', 'تسجيل دخول مدير النظام', 'System admin login', '192.168.1.100', '{"browser": "Chrome", "os": "Windows 10", "device": "Desktop", "location": "Najran, Saudi Arabia"}'),
('patient-001', 'book_appointment', 'حجز موعد جديد', 'New appointment booking', '192.168.1.101', '{"browser": "Safari", "os": "iOS 16", "device": "Mobile", "location": "Najran, Saudi Arabia", "appointmentId": "APT-2025-001", "appointmentDate": "2025-01-25T14:30:00", "department": "قسم الباطنة"}'),
('staff-001', 'process_request', 'معالجة طلب خدمة', 'Service request processing', '192.168.1.102', '{"browser": "Chrome", "os": "macOS", "device": "Desktop", "location": "Najran, Saudi Arabia", "requestId": "REQ-2025-001", "requestType": "فحص مختبري", "action": "approve", "notes": "تمت الموافقة على الطلب"}'),
('news-manager-001', 'add_news', 'إضافة خبر جديد', 'New news article added', '192.168.1.103', '{"browser": "Chrome", "os": "Windows 10", "device": "Desktop", "location": "Najran, Saudi Arabia", "newsId": "NEWS-2025-001", "newsTitle": "افتتاح وحدة جديدة للعناية المركزة", "action": "create"}'),
('doctor-001', 'login', 'تسجيل دخول طبيب', 'Doctor login', '192.168.1.105', '{"browser": "Chrome", "os": "Windows 10", "device": "Desktop", "location": "Najran, Saudi Arabia"}'),
('dept-head-001', 'login', 'تسجيل دخول رئيس قسم', 'Department head login', '192.168.1.106', '{"browser": "Firefox", "os": "Windows 10", "device": "Desktop", "location": "Najran, Saudi Arabia"}'),
('facility-manager-001', 'login', 'تسجيل دخول مدير منشأة', 'Facility manager login', '192.168.1.107', '{"browser": "Edge", "os": "Windows 11", "device": "Desktop", "location": "Najran, Saudi Arabia"}');

-- تعليقات ختامية
/*
  قاعدة البيانات تحتوي على:
  1. جداول المستخدمين والصلاحيات
  2. جداول المنشآت والأقسام والخدمات
  3. جداول الطلبات والإشعارات
  4. جداول المحتوى (الأخبار، صور البطل، الإنجازات، الأسئلة الشائعة)
  5. جداول سجل النشاطات
  6. جداول إضافية (إتاحة الأطباء، إسناد الطلبات، بلاغات الطلبات، العناصر المخفية)
  7. فهارس لتحسين الأداء
  8. وظائف مفيدة
  9. بيانات وهمية للاختبار
  
  لاستيراد قاعدة البيانات:
  psql -d najran_health_cluster -f najran_health_cluster_database.sql
*/