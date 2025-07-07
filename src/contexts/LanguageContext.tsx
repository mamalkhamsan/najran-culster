import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'ar' | 'en';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    // Header
    'home': 'الرئيسية',
    'about': 'نبذة عنا',
    'statistics': 'الإحصائيات',
    'services': 'خدماتنا',
    'news': 'الأخبار',
    'media_library': 'الملف الإعلامي',
    'platform': 'منصة الخدمات',
    'contact': 'تواصل معنا',
    'login': 'تسجيل الدخول',
    'register': 'التسجيل',
    'logout': 'تسجيل الخروج',
    
    // Homepage
    'hero_title': 'تجمع نجران الصحي',
    'hero_subtitle': 'تجربة صحية رقمية متطورة تجمع بين الابتكار والرعاية الشخصية',
    'hero_description': 'لخدمة أفضل وأسرع للمرضى والمراجعين',
    'access_platform': 'دخول المنصة',
    'learn_more': 'اعرف المزيد',
    
    // Statistics
    'facilities': 'المنشآت',
    'health_centers': 'المراكز الصحية',
    'departments': 'الأقسام',
    'daily_patients': 'المرضى اليومي',
    
    // Services
    'our_services': ' خدماتنا الرقمية',
    'service_1': 'الخدمات الطارئة',
    'service_2': 'العيادات الخارجية',
    'service_3': 'الخدمات التشخيصية',
    'service_4': 'خدمات الأمومة والطفولة',
    
    // Apps
    'health_apps': 'المنصات الصحية',
    'seha_app': 'تطبيق صحتي',
    'anaat_app': 'تطبيق أناة',
    'mawid_app': 'تطبيق موعد',
    'download': 'تحميل',
    
    // Footer
    'rights_reserved': 'جميع الحقوق محفوظة',
    'digital_health_dept': 'الإدارة التنفيذية للصحة الرقمية',
    'business_solutions': 'إدارة حلول الأعمال',
    'terms': 'الشروط والأحكام',
    'privacy': 'سياسة الخصوصية',
    
    // Authentication
    'national_id': 'رقم الهوية الوطنية',
    'password': 'كلمة المرور',
    'full_name': 'الاسم الكامل',
    'mobile': 'رقم الجوال',
    'birth_date': 'تاريخ الميلاد',
    'email': 'البريد الإلكتروني (اختياري)',
    'confirm_password': 'تأكيد كلمة المرور',
    'accept_terms': 'أوافق على الشروط والأحكام',
    'create_account': 'إنشاء حساب',
    'already_have_account': 'لديك حساب بالفعل؟',
    'dont_have_account': 'ليس لديك حساب؟',
    
    // Platform
    'user_dashboard': 'لوحة تحكم المستخدم',
    'inbox': 'صندوق الوارد',
    'documents': 'محفظة المستندات',
    'reminders': 'التذكيرات',
    'profile': 'الملف الشخصي',
    'live_display': 'العرض المباشر',
    'reports': 'التقارير والإحصائيات',
    'request_services': 'طلب الخدمات',
    'process_requests': 'معالجة الطلبات',
    'submit_complaint': 'تقديم شكوى',
    'complaint_history': 'سجل الشكاوى',
    'manage_complaints': 'إدارة الشكاوى',
    
    // Admin
    'admin_panel': 'لوحة الإدارة',
    'manage_facilities': 'إدارة المنشآت',
    'manage_departments': 'إدارة الأقسام',
    'manage_services': 'إدارة الخدمات',
    'manage_doctors': 'إدارة الأطباء',
   'manage_staff': 'إدارة الموظفين',
    'manage_permissions': 'إدارة الصلاحيات',
    'system_settings': 'إعدادات النظام',
    'homepage_settings': 'إعدادات الصفحة الرئيسية',
    'content_management': 'إدارة المحتوى',
    
    // System Admin
    'database_management': 'إدارة قاعدة البيانات',
    'security_center': 'مركز الأمان',
    'system_monitoring': 'مراقبة النظام',
    'audit_logs': 'سجلات التدقيق',
    'advanced_settings': 'الإعدادات المتقدمة',
    'approve_services': 'اعتماد الخدمات',
    'ratings': 'تقييمات الخدمات'
  },
  en: {
    // Header
    'home': 'Home',
    'about': 'About Us',
    'statistics': 'Statistics',
    'services': 'Our Services',
    'news': 'News',
    'media_library': 'Media Library',
    'platform': 'Services Platform',
    'contact': 'Contact Us',
    'login': 'Login',
    'register': 'Register',
    'logout': 'Logout',
    
    // Homepage
    'hero_title': 'Najran Health Cluster',
    'hero_subtitle': 'Advanced Digital Health Experience Combining Innovation and Personal Care',
    'hero_description': 'For Better and Faster Service to Patients and Visitors',
    'access_platform': 'Access Platform',
    'learn_more': 'Learn More',
    
    // Statistics
    'facilities': 'Facilities',
    'health_centers': 'Health Centers',
    'departments': 'Departments',
    'daily_patients': 'Daily Patients',
    
    // Services
    'our_services': 'Our Services',
    'service_1': 'Emergency Services',
    'service_2': 'Outpatient Clinics',
    'service_3': 'Diagnostic Services',
    'service_4': 'Maternal & Child Services',
    
    // Apps
    'health_apps': 'Health Apps',
    'seha_app': 'Seha App',
    'anaat_app': 'Anaat App',
    'mawid_app': 'Mawid App',
    'download': 'Download',
    
    // Footer
    'rights_reserved': 'All Rights Reserved',
    'digital_health_dept': 'Digital Health Executive Department',
    'business_solutions': 'Business Solutions Department',
    'terms': 'Terms & Conditions',
    'privacy': 'Privacy Policy',
    
    // Authentication
    'national_id': 'National ID',
    'password': 'Password',
    'full_name': 'Full Name',
    'mobile': 'Mobile Number',
    'birth_date': 'Birth Date',
    'email': 'Email (Optional)',
    'confirm_password': 'Confirm Password',
    'accept_terms': 'I agree to the Terms & Conditions',
    'create_account': 'Create Account',
    'already_have_account': 'Already have an account?',
    'dont_have_account': "Don't have an account?",
    
    // Platform
    'user_dashboard': 'User Dashboard',
    'inbox': 'Inbox',
    'documents': 'Document Wallet',
    'reminders': 'Reminders',
    'profile': 'Profile',
    'live_display': 'Live Display',
    'reports': 'Reports & Statistics',
    'request_services': 'Request Services',
    'process_requests': 'Process Requests',
    'submit_complaint': 'Submit Complaint',
    'complaint_history': 'Complaint History',
    'manage_complaints': 'Manage Complaints',
    
    // Admin
    'admin_panel': 'Admin Panel',
    'manage_facilities': 'Manage Facilities',
    'manage_departments': 'Manage Departments',
    'manage_services': 'Manage Services',
    'manage_doctors': 'Manage Doctors',
   'manage_staff': 'Manage Staff',
    'manage_permissions': 'Manage Permissions',
    'system_settings': 'System Settings',
    'homepage_settings': 'Homepage Settings',
    'content_management': 'Content Management',
    
    // System Admin
    'database_management': 'Database Management',
    'security_center': 'Security Center',
    'system_monitoring': 'System Monitoring',
    'audit_logs': 'Audit Logs',
    'advanced_settings': 'Advanced Settings',
    'approve_services': 'Approve Services',
    'ratings': 'Service Ratings'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'font-arabic' : 'font-english'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};