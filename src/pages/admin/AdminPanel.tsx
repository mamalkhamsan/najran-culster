import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Building,
  Users,
  Briefcase, 
  Shield, 
  Settings, 
  Home, 
  BarChart3, 
  Star, 
  Monitor,
  FileText,
  Award,
  HelpCircle,
  Database,
  Lock,
  Activity, 
  FileCheck,
  LayoutDashboard,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import FacilitiesManagement from './FacilitiesManagement';
import DepartmentsManagement from './DepartmentsManagement';
import ServicesManagement from './ServicesManagement';
import PermissionsManagement from './PermissionsManagement';
import SystemSettings from './SystemSettings';
import HomepageSettings from './HomepageSettings';
import ContentManagement from './ContentManagement';
import RatingsManagement from './RatingsManagement';
import ApproveServices from './ApproveServices';
import SystemMonitoring from './SystemMonitoring';
import AuditLogs from './AuditLogs';
import AdvancedSettings from './AdvancedSettings';
import DoctorsManagement from './DoctorsManagement';
import StaffManagement from './StaffManagement';
import ComplaintsManagement from './ComplaintsManagement';

const AdminPanel: React.FC = () => {
  const { language, t } = useLanguage();
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  // Check if user exists
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'يرجى تسجيل الدخول' : 'Please Login'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ar' 
              ? 'يجب تسجيل الدخول للوصول إلى لوحة الإدارة'
              : 'You must be logged in to access the admin panel'
            }
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </div>
    );
  }

  // Check if user has admin permissions
  const isAdmin = user?.role === 'system_admin' || user?.role === 'admin';
  const isFacilityManager = user?.role === 'manager';
  const isDepartmentHead = user?.role === 'department_head';

  if (!isAdmin && !isFacilityManager && !isDepartmentHead && !hasPermission('system_settings')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'غير مصرح' : 'Unauthorized'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ar' 
              ? 'ليس لديك صلاحية للوصول إلى لوحة الإدارة'
              : 'You do not have permission to access the admin panel'
            }
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: Home, key: 'homepage_settings', path: '/admin', color: 'text-blue-600', permission: 'homepage_settings' },
    { icon: FileText, key: 'content_management', path: '/admin/content', color: 'text-purple-600', permission: 'manage_hero_images' || 'manage_publications' || 'manage_faqs' || 'manage_news' || 'manage_achievements' },
    { icon: Star, key: 'ratings', path: '/admin/ratings', color: 'text-yellow-600', permission: 'view_ratings' }, 
    { icon: Building, key: 'manage_facilities', path: '/admin/facilities', color: 'text-indigo-600', permission: 'facility_management' },
    { icon: Users, key: 'manage_departments', path: '/admin/departments', color: 'text-pink-600', permission: 'department_management' },
    { icon: Briefcase, key: 'manage_services', path: '/admin/services', color: 'text-yellow-600', permission: 'service_management' }, 
    { icon: Users, key: 'manage_doctors', path: '/admin/doctors', color: 'text-cyan-600', permission: 'manage_doctors' },
   { icon: Users, key: 'manage_staff', path: '/admin/staff', color: 'text-emerald-600', permission: 'manage_staff' },
    { icon: FileCheck, key: 'approve_services', path: '/admin/approve-services', color: 'text-teal-600', permission: 'approve_services' },
    { icon: Shield, key: 'manage_permissions', path: '/admin/permissions', color: 'text-red-600', permission: 'permissions_management' },
    { icon: Monitor, key: 'live_display', path: '/admin/live-display', color: 'text-green-600', permission: 'live_display_management' },
    { icon: BarChart3, key: 'reports', path: '/admin/reports', color: 'text-purple-600', permission: 'reports_management' },
    { icon: MessageSquare, key: 'manage_complaints', path: '/admin/complaints', color: 'text-indigo-600', permission: 'manage_complaints' },
    { icon: Settings, key: 'system_settings', path: '/admin/settings', color: 'text-gray-600', permission: 'system_settings' },
    { icon: Monitor, key: 'system_monitoring', path: '/admin/monitoring', color: 'text-blue-600', permission: 'system_monitoring' },
    { icon: Activity, key: 'audit_logs', path: '/admin/audit-logs', color: 'text-orange-600', permission: 'audit_logs' },
    { icon: Settings, key: 'advanced_settings', path: '/admin/advanced-settings', color: 'text-indigo-600', permission: 'advanced_settings' }
  ];

  // فلترة العناصر حسب الصلاحيات
  const availableMenuItems = menuItems.filter(item => hasPermission(item.permission));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Fixed on desktop, sliding on mobile */}
        <div className="w-64 bg-white shadow-lg min-h-screen hidden lg:block">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {t('admin_panel')}
              </h2>
              <Link
                to="/platform/dashboard"
                className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
              </Link>
            </div>
          </div>
          <nav className="p-4">
            <div className="space-y-2">
              {availableMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`w-full flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : item.color}`} />
                    <span className="font-medium">{t(item.key)}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 w-full lg:w-auto">
          {/* Mobile Header with Menu Button */}
          <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-900">
              {t('admin_panel')}
            </h2>
            <Link
              to="/platform/dashboard"
              className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
            </Link>
          </div>
          
          <Routes>
            <Route path="/" element={<HomepageSettings />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/facilities" element={<FacilitiesManagement />} />
            <Route path="/departments" element={<DepartmentsManagement />} />
            <Route path="/services" element={<ServicesManagement />} />
            <Route path="/doctors" element={<DoctorsManagement />} />
            <Route path="/ratings" element={<RatingsManagement />} />
           <Route path="/staff" element={<StaffManagement />} />
            <Route path="/approve-services" element={<ApproveServices />} />
            <Route path="/permissions" element={<PermissionsManagement />} />
            <Route path="/complaints" element={<ComplaintsManagement />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="/monitoring" element={<SystemMonitoring />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/advanced-settings" element={<AdvancedSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;