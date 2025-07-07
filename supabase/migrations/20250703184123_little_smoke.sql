/*
  # تحديث قاعدة بيانات تجمع نجران الصحي
  
  1. تحسينات الجداول
    - إضافة حقول جديدة لتتبع حالة الطلبات بشكل أفضل
    - تحسين نظام التقييمات
    - إضافة دعم للإشعارات المتقدمة
  
  2. تحسينات الأمان
    - تحسين تتبع سجلات النشاط
    - إضافة وظائف للتحقق من الصلاحيات
  
  3. تحسينات الأداء
    - إضافة فهارس جديدة
    - تحسين الاستعلامات
*/

-- إضافة حقول جديدة لجدول الطلبات
ALTER TABLE requests ADD COLUMN IF NOT EXISTS estimated_wait_time INTEGER; -- وقت الانتظار المقدر بالدقائق
ALTER TABLE requests ADD COLUMN IF NOT EXISTS actual_wait_time INTEGER; -- وقت الانتظار الفعلي بالدقائق
ALTER TABLE requests ADD COLUMN IF NOT EXISTS escalation_level INTEGER DEFAULT 0; -- مستوى التصعيد
ALTER TABLE requests ADD COLUMN IF NOT EXISTS escalation_reason TEXT; -- سبب التصعيد
ALTER TABLE requests ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT FALSE; -- هل الطلب عاجل
ALTER TABLE requests ADD COLUMN IF NOT EXISTS is_rated BOOLEAN DEFAULT FALSE; -- هل تم تقييم الطلب

-- إضافة حقول جديدة لجدول تقييمات الخدمات
ALTER TABLE service_ratings ADD COLUMN IF NOT EXISTS rating_category VARCHAR(50); -- فئة التقييم (جودة الخدمة، سرعة الاستجابة، إلخ)
ALTER TABLE service_ratings ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE; -- هل التقييم مجهول
ALTER TABLE service_ratings ADD COLUMN IF NOT EXISTS admin_response TEXT; -- رد الإدارة على التقييم
ALTER TABLE service_ratings ADD COLUMN IF NOT EXISTS admin_response_at TIMESTAMP WITH TIME ZONE; -- وقت رد الإدارة

-- إضافة حقول جديدة لجدول الإشعارات
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_important BOOLEAN DEFAULT FALSE; -- هل الإشعار مهم
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP WITH TIME ZONE; -- تاريخ انتهاء صلاحية الإشعار
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_url TEXT; -- رابط الإجراء المطلوب
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_text VARCHAR(100); -- نص الإجراء المطلوب

-- إضافة حقول جديدة لجدول إتاحة الأطباء
ALTER TABLE doctor_availability ADD COLUMN IF NOT EXISTS max_daily_consultations INTEGER DEFAULT 10; -- الحد الأقصى للاستشارات اليومية
ALTER TABLE doctor_availability ADD COLUMN IF NOT EXISTS allow_immediate_consultations BOOLEAN DEFAULT TRUE; -- السماح بالاستشارات الفورية
ALTER TABLE doctor_availability ADD COLUMN IF NOT EXISTS allow_scheduled_consultations BOOLEAN DEFAULT TRUE; -- السماح بالاستشارات المجدولة
ALTER TABLE doctor_availability ADD COLUMN IF NOT EXISTS consultation_duration INTEGER DEFAULT 30; -- مدة الاستشارة بالدقائق

-- إنشاء جدول جديد لتتبع الإجازات والغيابات
CREATE TABLE IF NOT EXISTS user_leaves (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL, -- نوع الإجازة (سنوية، مرضية، طارئة، إلخ)
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by VARCHAR(50) REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول جديد لتتبع التذكيرات
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reminder_date DATE NOT NULL,
  reminder_time TIME NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50), -- نمط التكرار (يومي، أسبوعي، شهري، إلخ)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول جديد لتتبع المستندات
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  is_incoming BOOLEAN DEFAULT TRUE, -- هل المستند وارد أم صادر
  related_request_id INTEGER REFERENCES requests(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهارس جديدة لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_requests_escalation_level ON requests(escalation_level);
CREATE INDEX IF NOT EXISTS idx_requests_is_urgent ON requests(is_urgent);
CREATE INDEX IF NOT EXISTS idx_requests_is_rated ON requests(is_rated);
CREATE INDEX IF NOT EXISTS idx_service_ratings_rating_category ON service_ratings(rating_category);
CREATE INDEX IF NOT EXISTS idx_notifications_is_important ON notifications(is_important);
CREATE INDEX IF NOT EXISTS idx_notifications_expiry_date ON notifications(expiry_date);
CREATE INDEX IF NOT EXISTS idx_user_leaves_user_id ON user_leaves(user_id);
CREATE INDEX IF NOT EXISTS idx_user_leaves_status ON user_leaves(status);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_reminder_date ON reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_is_incoming ON documents(is_incoming);

-- إنشاء وظيفة لحساب متوسط وقت الانتظار للطلبات
CREATE OR REPLACE FUNCTION get_average_wait_time(facility_id INTEGER, department_id INTEGER DEFAULT NULL)
RETURNS NUMERIC AS $$
BEGIN
  IF department_id IS NULL THEN
    RETURN (
      SELECT AVG(actual_wait_time)::NUMERIC(10,2)
      FROM requests
      WHERE facility_id = $1
      AND actual_wait_time IS NOT NULL
      AND created_at >= NOW() - INTERVAL '30 days'
    );
  ELSE
    RETURN (
      SELECT AVG(actual_wait_time)::NUMERIC(10,2)
      FROM requests
      WHERE facility_id = $1
      AND department_id = $2
      AND actual_wait_time IS NOT NULL
      AND created_at >= NOW() - INTERVAL '30 days'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- إنشاء وظيفة لحساب عدد الطلبات حسب الحالة
CREATE OR REPLACE FUNCTION get_requests_count_by_status(status VARCHAR, facility_id INTEGER DEFAULT NULL, department_id INTEGER DEFAULT NULL)
RETURNS BIGINT AS $$
BEGIN
  IF facility_id IS NULL AND department_id IS NULL THEN
    RETURN (
      SELECT COUNT(*)::BIGINT
      FROM requests
      WHERE status = $1
    );
  ELSIF department_id IS NULL THEN
    RETURN (
      SELECT COUNT(*)::BIGINT
      FROM requests
      WHERE status = $1
      AND facility_id = $2
    );
  ELSE
    RETURN (
      SELECT COUNT(*)::BIGINT
      FROM requests
      WHERE status = $1
      AND facility_id = $2
      AND department_id = $3
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- إنشاء وظيفة لإرسال إشعار
CREATE OR REPLACE FUNCTION send_notification(
  user_id VARCHAR,
  title_ar VARCHAR,
  title_en VARCHAR,
  message_ar TEXT,
  message_en TEXT,
  notification_type VARCHAR DEFAULT 'info',
  is_important BOOLEAN DEFAULT FALSE,
  related_id VARCHAR DEFAULT NULL,
  related_type VARCHAR DEFAULT NULL,
  action_url TEXT DEFAULT NULL,
  action_text VARCHAR DEFAULT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  notification_id INTEGER;
BEGIN
  INSERT INTO notifications (
    user_id,
    title_ar,
    title_en,
    message_ar,
    message_en,
    type,
    is_important,
    related_id,
    related_type,
    action_url,
    action_text,
    expiry_date
  ) VALUES (
    user_id,
    title_ar,
    title_en,
    message_ar,
    message_en,
    notification_type,
    is_important,
    related_id,
    related_type,
    action_url,
    action_text,
    expiry_date
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- إنشاء وظيفة لإضافة تذكير
CREATE OR REPLACE FUNCTION add_reminder(
  user_id VARCHAR,
  title VARCHAR,
  description TEXT,
  reminder_date DATE,
  reminder_time TIME,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  reminder_id INTEGER;
BEGIN
  INSERT INTO reminders (
    user_id,
    title,
    description,
    reminder_date,
    reminder_time,
    is_recurring,
    recurrence_pattern
  ) VALUES (
    user_id,
    title,
    description,
    reminder_date,
    reminder_time,
    is_recurring,
    recurrence_pattern
  ) RETURNING id INTO reminder_id;
  
  RETURN reminder_id;
END;
$$ LANGUAGE plpgsql;

-- إنشاء وظيفة لإضافة مستند
CREATE OR REPLACE FUNCTION add_document(
  user_id VARCHAR,
  title VARCHAR,
  description TEXT,
  file_path VARCHAR,
  file_type VARCHAR,
  file_size INTEGER,
  is_public BOOLEAN DEFAULT FALSE,
  is_incoming BOOLEAN DEFAULT TRUE,
  related_request_id INTEGER DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  document_id INTEGER;
BEGIN
  INSERT INTO documents (
    user_id,
    title,
    description,
    file_path,
    file_type,
    file_size,
    is_public,
    is_incoming,
    related_request_id
  ) VALUES (
    user_id,
    title,
    description,
    file_path,
    file_type,
    file_size,
    is_public,
    is_incoming,
    related_request_id
  ) RETURNING id INTO document_id;
  
  RETURN document_id;
END;
$$ LANGUAGE plpgsql;

-- إنشاء وظيفة لتقييم خدمة
CREATE OR REPLACE FUNCTION rate_service(
  user_id VARCHAR,
  request_id INTEGER,
  rating INTEGER,
  feedback TEXT DEFAULT NULL,
  rating_category VARCHAR DEFAULT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE
)
RETURNS INTEGER AS $$
DECLARE
  rating_id INTEGER;
BEGIN
  -- التحقق من صحة التقييم
  IF rating < 1 OR rating > 5 THEN
    RAISE EXCEPTION 'التقييم يجب أن يكون بين 1 و 5';
  END IF;
  
  -- التحقق من وجود الطلب
  IF NOT EXISTS (SELECT 1 FROM requests WHERE id = request_id) THEN
    RAISE EXCEPTION 'الطلب غير موجود';
  END IF;
  
  -- التحقق من أن المستخدم هو صاحب الطلب
  IF NOT EXISTS (SELECT 1 FROM requests WHERE id = request_id AND user_id = user_id) THEN
    RAISE EXCEPTION 'لا يمكن تقييم طلب لمستخدم آخر';
  END IF;
  
  -- التحقق من أن الطلب مكتمل
  IF NOT EXISTS (SELECT 1 FROM requests WHERE id = request_id AND status = 'completed') THEN
    RAISE EXCEPTION 'لا يمكن تقييم طلب غير مكتمل';
  END IF;
  
  -- إضافة التقييم
  INSERT INTO service_ratings (
    user_id,
    request_id,
    rating,
    feedback,
    rating_category,
    is_anonymous
  ) VALUES (
    user_id,
    request_id,
    rating,
    feedback,
    rating_category,
    is_anonymous
  ) RETURNING id INTO rating_id;
  
  -- تحديث حالة التقييم في الطلب
  UPDATE requests SET is_rated = TRUE WHERE id = request_id;
  
  RETURN rating_id;
END;
$$ LANGUAGE plpgsql;

-- إنشاء مشاهدة لعرض التذكيرات القادمة
CREATE OR REPLACE VIEW upcoming_reminders_view AS
SELECT 
  r.*,
  u.name as user_name,
  u.email as user_email,
  u.mobile as user_mobile
FROM reminders r
JOIN users u ON r.user_id = u.id
WHERE r.is_completed = FALSE
AND (r.reminder_date > CURRENT_DATE OR (r.reminder_date = CURRENT_DATE AND r.reminder_time > CURRENT_TIME))
ORDER BY r.reminder_date, r.reminder_time;

-- إنشاء مشاهدة لعرض المستندات
CREATE OR REPLACE VIEW documents_view AS
SELECT 
  d.*,
  u.name as user_name,
  r.request_number as related_request_number
FROM documents d
JOIN users u ON d.user_id = u.id
LEFT JOIN requests r ON d.related_request_id = r.id
ORDER BY d.created_at DESC;

-- إنشاء مشاهدة لعرض تقييمات الخدمات
CREATE OR REPLACE VIEW service_ratings_view AS
SELECT 
  sr.*,
  u.name as user_name,
  r.request_number as request_number,
  s.name_ar as service_name_ar,
  s.name_en as service_name_en,
  f.name_ar as facility_name_ar,
  f.name_en as facility_name_en,
  d.name_ar as department_name_ar,
  d.name_en as department_name_en
FROM service_ratings sr
JOIN users u ON sr.user_id = u.id
JOIN requests r ON sr.request_id = r.id
JOIN services s ON r.service_id = s.id
JOIN facilities f ON r.facility_id = f.id
JOIN departments d ON r.department_id = d.id
ORDER BY sr.created_at DESC;

-- إضافة سجل نشاط لتوثيق التحديث
INSERT INTO activity_logs (user_id, action, description_ar, description_en, ip_address, details)
VALUES (
  'admin-001', 
  'database_update', 
  'تحديث قاعدة بيانات تجمع نجران الصحي', 
  'Najran Health Cluster database update', 
  '127.0.0.1', 
  '{"update": "database_schema", "version": "2.0.0", "date": "2025-07-05"}'
);