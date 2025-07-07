import React, { createContext, useContext, useState, ReactNode } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import { useLanguage } from './LanguageContext';

export interface HiddenElement {
  elementType: string;
  elementId: string;
  elementName?: string;
  isHidden: boolean;
}

interface User {
  id: string;
  name: string;
  nationalId: string;
  role: 'patient' | 'staff' | 'department_head' | 'manager' | 'supervisor' | 'admin' | 'system_admin' | 'doctor';
  email?: string;
  mobile: string;
  facility?: string;
  department?: string;
  permissions?: string[];
  hiddenElements?: HiddenElement[];
}

interface AuthContextType {
  user: User | null;
  login: (nationalId: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hideElement: (elementType: string, elementId: string, elementName?: string) => void;
  unhideElement: (elementType: string, elementId: string) => void;
  isElementHidden: (elementType: string, elementId: string) => boolean;
  getHiddenElements: () => HiddenElement[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [hiddenElements, setHiddenElements] = useState<HiddenElement[]>([]);

  // قاعدة بيانات المستخدمين المحددة مسبقاً مع الصلاحيات الجديدة
  const predefinedUsers = [
    {
      id: 'admin-001',
      name: 'مدير النظام الرئيسي',
      nationalId: '1111111111',
      password: 'Admin@2025',
      role: 'system_admin' as const,
      email: 'system.admin@najran-health.gov.sa',
      mobile: '0545048999',
      facility: 'تجمع نجران الصحي',
      department: 'إدارة تقنية المعلومات',
      permissions: [
        'full_system_access',
        'user_management',
        'permissions_management',
        'hide_elements',
        'facility_management',
        'department_management',
        'service_management',
        'system_settings',
        'homepage_settings',
        'reports_management',
        'live_display_management',
        'backup_restore',
        'security_settings',
        'audit_logs',
        // صلاحيات إدارة المحتوى الجديدة
        'manage_hero_images',
        'add_hero_images',
        'delete_hero_images',
        'edit_hero_images',
        'manage_news',
        'add_news',
        'edit_news',
        'delete_news',
        'publish_news',
        'manage_achievements',
        'add_achievements',
        'edit_achievements',
        'delete_achievements',
        'manage_faqs',
        'add_faqs',
        'edit_faqs',
        'delete_faqs',
        'content_moderation',
        'manage_statistics',
        'view_statistics',
        'export_pdf',
        'auto_response_bot',
        'manage_media_files',
        'approve_services',
        'service_availability',
        'view_all_requests',
        'assign_requests',
        'escalate_requests',
        'live_display_management',
        'database_management',
        'view_ratings',
        'manage_ratings', 
        'request_new_service',
        'add_auto_response',
        'edit_auto_response',
        'delete_auto_response'
      ]
    },
    {
      id: 'admin-002',
      name: 'أحمد محمد السالم',
      nationalId: '1234567890',
      password: 'Manager@123',
      role: 'admin' as const,
      email: 'ahmed.salem@najran-health.gov.sa',
      mobile: '0501234567',
      facility: 'مستشفى الملك خالد',
      department: 'الإدارة العامة',
      permissions: [
        'view_requests',
        'process_requests',
        'send_notifications',
        'generate_reports',
        'manage_staff',
        'facility_management',
        'department_management',
        'service_management',
        // صلاحيات إدارة المحتوى للمسؤول
        'manage_hero_images',
        'add_hero_images',
        'delete_hero_images',
        'edit_hero_images',
        'manage_news',
        'add_news',
        'edit_news',
        'delete_news',
        'publish_news',
        'manage_achievements',
        'add_achievements',
        'edit_achievements',
        'delete_achievements',
        'manage_faqs',
        'add_faqs',
        'edit_faqs',
        'delete_faqs',
        'view_statistics',
        'export_pdf',
        'approve_services',
        'service_availability',
        'view_all_requests',
        'assign_requests',
        'live_display_management',
        'add_auto_response',
        'edit_auto_response',
        'delete_auto_response'
      ]
    },
    {
      id: 'news-manager-001',
      name: 'سارة أحمد الزهراني',
      nationalId: '2234567890',
      password: 'News@123',
      role: 'staff' as const,
      email: 'sara.alzahrani@najran-health.gov.sa',
      mobile: '0502234567',
      facility: 'تجمع نجران الصحي',
      department: 'إدارة التواصل والإعلام',
      permissions: [
        'manage_news',
        'add_news',
        'edit_news',
        'delete_news',
        'publish_news',
        'manage_media_files',
        'content_moderation',
        'live_display_management',
        'view_ratings',
        'manage_ratings', 
        'live_display_management'
      ]
    },
    {
      id: 'media-manager-001',
      name: 'محمد علي القحطاني',
      nationalId: '3234567890',
      password: 'Media@123',
      role: 'staff' as const,
      email: 'mohammed.alqahtani@najran-health.gov.sa',
      mobile: '0503234567',
      facility: 'تجمع نجران الصحي',
      department: 'الملف الإعلامي',
      permissions: [
        'manage_hero_images',
        'add_hero_images',
        'delete_hero_images',
        'edit_hero_images',
        'manage_achievements',
        'add_achievements',
        'edit_achievements',
        'delete_achievements',
        'manage_media_files',
        'live_display_management'
      ]
    },
    {
      id: 'stats-manager-001',
      name: 'فاطمة سعد النعمي',
      nationalId: '4234567890',
      password: 'Stats@123',
      role: 'staff' as const,
      email: 'fatima.alnaami@najran-health.gov.sa',
      mobile: '0504234567',
      facility: 'تجمع نجران الصحي',
      department: 'إدارة الإحصائيات والتقارير',
      permissions: [
        'manage_statistics',
        'view_statistics',
        'generate_reports',
        'export_pdf',
        'live_display_management'
      ]
    },
    {
      id: 'faq-manager-001',
      name: 'عبدالله محمد الشهري',
      nationalId: '5234567890',
      password: 'FAQ@123',
      role: 'staff' as const,
      email: 'abdullah.alshahri@najran-health.gov.sa',
      mobile: '0505234567',
      facility: 'تجمع نجران الصحي',
      department: 'خدمة العملاء والدعم',
      permissions: [
        'manage_faqs',
        'add_faqs',
        'edit_faqs',
        'delete_faqs',
        'manage_media_files',
        'auto_response_bot',
        'live_display_management',
        'manage_publications',
        'add_publications',
        'edit_publications',
        'delete_publications',
        'add_auto_response', 
        'edit_auto_response', 
        'delete_auto_response'
      ]
    },
    {
      id: 'staff-001',
      name: 'فاطمة علي أحمد',
      nationalId: '0987654321',
      password: 'Staff@123',
      role: 'staff' as const,
      email: 'fatima.ali@najran-health.gov.sa',
      mobile: '0509876543',
      facility: 'مستشفى الملك خالد',
      department: 'قسم الطوارئ',
      permissions: [
        'view_requests',
        'process_requests',
        'send_notifications',
        'live_display_management'
      ]
    },
    {
      id: 'doctor-001',
      name: 'د. خالد محمد العتيبي',
      nationalId: '6543210987',
      password: 'Doctor@123',
      role: 'doctor' as const,
      email: 'khalid.alotaibi@najran-health.gov.sa',
      mobile: '0512345678',
      facility: 'مستشفى الملك خالد',
      department: 'قسم الباطنة',
      permissions: [
        'view_requests',
        'process_requests',
        'send_notifications',
        'view_medical_records',
        'provide_consultations',
        'doctor_availability',
        'live_display_management',
        'view_medical_records'
      ]
    },
    {
      id: 'dept-head-001',
      name: 'د. سلطان عبدالله الشمري',
      nationalId: '7654321098',
      password: 'Head@123',
      role: 'department_head' as const,
      email: 'sultan.alshammari@najran-health.gov.sa',
      mobile: '0523456789',
      facility: 'مستشفى الملك خالد',
      department: 'قسم الطوارئ',
      permissions: [
        'view_requests',
        'process_requests',
        'send_notifications',
        'manage_staff',
        'view_statistics',
        'generate_reports',
        'assign_requests',
        'escalate_requests',
        'live_display_management',
        'view_medical_records',
        'manage_doctors'
      ]
    },
    {
      id: 'facility-manager-001',
      name: 'د. ناصر محمد القحطاني',
      nationalId: '8765432109',
      password: 'Manager@123',
      role: 'manager' as const,
      email: 'nasser.alqahtani@najran-health.gov.sa',
      mobile: '0534567890',
      facility: 'مستشفى الملك خالد',
      department: 'إدارة المستشفى',
      permissions: [
        'view_requests',
        'process_requests',
        'send_notifications',
        'manage_staff',
        'view_statistics',
        'generate_reports',
        'facility_management',
        'department_management',
        'service_management',
        'assign_requests',
        'escalate_requests',
        'approve_services',
        'service_availability',
        'view_all_requests',
        'live_display_management',
        'database_management',
        'view_ratings',
        'manage_ratings', 
        'request_new_service',
        'manage_publications',
        'add_publications',
        'edit_publications',
        'delete_publications',
        'add_auto_response',
        'edit_auto_response',
        'delete_auto_response'
      ]
    },
    {
      id: 'patient-001',
      name: 'محمد سعد القحطاني',
      nationalId: '1122334455',
      password: 'Patient@123',
      role: 'patient' as const,
      email: 'mohammed.alqahtani@gmail.com',
      mobile: '0551122334',
      permissions: [
        'view_own_data',
        'book_appointments',
        'view_medical_records',
        'request_services',
        'patient_request_service',
        'add_auto_response', 
        'edit_auto_response', 
        'delete_auto_response',
        'manage_publications',
        'add_publications',
        'edit_publications',
        'delete_publications'
      ]
    }
  ];

  const login = async (nationalId: string, password: string): Promise<boolean> => {
    // البحث عن المستخدم في قاعدة البيانات المحددة مسبقاً
    const foundUser = predefinedUsers.find(
      user => user.nationalId === nationalId && user.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      
      // حفظ بيانات المستخدم في localStorage للحفاظ على الجلسة
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return true;
    }

    return false;
  };

  const register = async (userData: any): Promise<boolean> => {
    // التحقق من عدم وجود المستخدم مسبقاً
    const existingUser = predefinedUsers.find(
      user => user.nationalId === userData.nationalId
    );

    if (existingUser) {
      alert('هذا الرقم الوطني مسجل مسبقاً');
      return false;
    }

    // إنشاء مستخدم جديد (مريض بشكل افتراضي)
    const newUser: User = {
      id: `patient-${Date.now()}`,
      name: userData.fullName,
      nationalId: userData.nationalId,
      role: 'patient',
      email: userData.email,
      mobile: userData.mobile,
      permissions: [
        'view_own_data',
        'book_appointments',
        'view_medical_records',
        'request_services'
      ]
    };

    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setShowLogoutConfirmation(false);
  };

  // دالة للتحقق من الصلاحيات
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    
    // مدير النظام الرئيسي له جميع الصلاحيات
    if (user.role === 'system_admin') return true;
    
    // مدير المنشأة له صلاحيات خاصة بمنشأته فقط
    if (user.role === 'manager' && permission === 'view_all_requests') {
      // يمكنه رؤية جميع الطلبات في منشأته فقط
      return true;
    }
    
    // رئيس القسم له صلاحيات خاصة بقسمه فقط
    if (user.role === 'department_head' && permission === 'view_all_requests') {
      // لا يمكنه رؤية جميع الطلبات، فقط طلبات قسمه
      return false;
    }
    
    return user.permissions.includes(permission);
  };

  // دالة لإخفاء عنصر
  const hideElement = (elementType: string, elementId: string, elementName?: string) => {
    if (!user || !hasPermission('hide_elements')) return;
    
    // إضافة العنصر إلى قائمة العناصر المخفية
    const newHiddenElement: HiddenElement = {
      elementType,
      elementId,
      elementName,
      elementName,
      isHidden: true
    };
    
    // تحديث حالة المستخدم
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const updatedHiddenElements: HiddenElement[] = [...(prevUser.hiddenElements || [])];
      const existingIndex = updatedHiddenElements.findIndex(
        el => el.elementType === elementType && el.elementId === elementId
      );
      
      if (existingIndex >= 0) {
        updatedHiddenElements[existingIndex] = {
          ...updatedHiddenElements[existingIndex],
          isHidden: true,
          elementName: elementName || updatedHiddenElements[existingIndex].elementName
        };
      } else {
        updatedHiddenElements.push(newHiddenElement);
      }
      
      const updatedUser = {
        ...prevUser,
        hiddenElements: updatedHiddenElements
      };
      
      // تحديث localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return updatedUser;
    });
  };

  // دالة لإلغاء إخفاء عنصر
  const unhideElement = (elementType: string, elementId: string) => {
    if (!user || !hasPermission('hide_elements')) return;
    
    // تحديث حالة المستخدم
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const updatedHiddenElements = [...(prevUser.hiddenElements || [])];
      const existingIndex = updatedHiddenElements.findIndex(
        el => el.elementType === elementType && el.elementId === elementId
      );
      
      if (existingIndex >= 0) {
        updatedHiddenElements[existingIndex].isHidden = false;
      }
      
      const updatedUser = {
        ...prevUser,
        hiddenElements: updatedHiddenElements
      };
      
      // تحديث localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return updatedUser;
    });
  };

  // دالة للتحقق مما إذا كان العنصر مخفيًا
  const isElementHidden = (elementType: string, elementId: string): boolean => {
    if (!user || !user.hiddenElements) return false;
    
    const hiddenElement = user.hiddenElements.find(
      el => el.elementType === elementType && el.elementId === elementId && el.isHidden
    );
    
    return !!hiddenElement;
  };

  // دالة للحصول على جميع العناصر المخفية
  const getHiddenElements = (): HiddenElement[] => {
    if (!user || !user.hiddenElements) return [];

    // فلترة العناصر المخفية فقط
    const hiddenElements = user.hiddenElements.filter(el => el.isHidden);
    
    // ترتيب العناصر حسب النوع
    return hiddenElements.sort((a, b) => {
      if (a.elementType !== b.elementType) {
        return a.elementType.localeCompare(b.elementType);
      }
      return a.elementId.localeCompare(b.elementId);
    });
  };

  // استرداد بيانات المستخدم من localStorage عند تحميل الصفحة
  React.useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        hasPermission,
        hideElement,
        unhideElement,
        isElementHidden,
        getHiddenElements
      }}
    >
      {children}
      
      {/* Confirmation Modal for Logout */}
      {showLogoutConfirmation && (
        <ConfirmationModal
          isOpen={showLogoutConfirmation}
          title={language === 'ar' ? 'تأكيد تسجيل الخروج' : 'Confirm Logout'}
          message={language === 'ar' ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?'}
          type="warning"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutConfirmation(false)}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};