import React, { useState } from 'react';
import { Plus, Edit, Search, Shield, User, Check, X, ChevronDown, ChevronUp, Eye, EyeOff, AlertTriangle, List, Info, Building, Users, Briefcase } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import HideElementButton from '../../components/HideElementButton'; 

const PermissionsManagement: React.FC = () => {
  const { language, t } = useLanguage();
  const { isElementHidden, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['all']);
  const [showPermissionsList, setShowPermissionsList] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  // بيانات تجريبية للمستخدمين
  const users = [
    { 
      id: '1', 
      name: 'أحمد محمد', 
      nationalId: '1234567890',
      role: 'staff',
      facility: 'مستشفى الملك خالد',
      department: 'قسم الطوارئ',
      permissions: ['view_requests', 'process_requests', 'send_notifications']
    },
    { 
      id: '2', 
      name: 'فاطمة علي', 
      nationalId: '0987654321',
      role: 'department_head',
      facility: 'مستشفى الملك خالد',
      department: 'قسم الباطنة',
      permissions: ['view_requests', 'process_requests', 'send_notifications', 'generate_reports', 'manage_staff']
    },
    { 
      id: '3', 
      name: 'محمد سالم', 
      nationalId: '1122334455',
      role: 'manager',
      facility: 'مستشفى نجران البلد',
      department: 'الإدارة',
      permissions: ['view_requests', 'process_requests', 'send_notifications', 'generate_reports', 'manage_staff', 'facility_management']
    },
    { 
      id: '4', 
      name: 'د. خالد محمد العتيبي', 
      nationalId: '6543210987',
      role: 'doctor',
      facility: 'مستشفى الملك خالد',
      department: 'قسم الباطنة',
      permissions: ['view_requests', 'process_requests', 'send_notifications', 'view_medical_records', 'provide_consultations']
    }
  ];

  // تصفية المستخدمين بناءً على البحث وحالة الإخفاء
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.nationalId.includes(searchTerm) ||
                         user.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch && (showHidden || !isElementHidden('user', user.id));
  });

  // تنظيم الصلاحيات حسب الفئات
  const permissionCategories = [
    {
      key: 'admin',
      name: language === 'ar' ? 'الإدارة' : 'Administration',
      permissions: [
        { key: 'user_management', name: 'إدارة المستخدمين', nameEn: 'User Management' },
        { key: 'permissions_management', name: 'إدارة الصلاحيات', nameEn: 'Permissions Management' },
        { key: 'facility_management', name: 'إدارة المنشآت', nameEn: 'Facility Management' },
        { key: 'department_management', name: 'إدارة الأقسام', nameEn: 'Department Management' },
        { key: 'service_management', name: 'إدارة الخدمات', nameEn: 'Service Management' },
        { key: 'system_settings', name: 'إعدادات النظام', nameEn: 'System Settings' },
        { key: 'homepage_settings', name: 'إعدادات الصفحة الرئيسية', nameEn: 'Homepage Settings' },
        { key: 'manage_staff', name: 'إدارة الموظفين', nameEn: 'Manage Staff' },
        { key: 'manage_doctors', name: 'إدارة الأطباء', nameEn: 'Manage Doctors' },
        { key: 'hide_elements', name: 'إخفاء العناصر', nameEn: 'Hide Elements' }
      ]
    },
    {
      key: 'content',
      name: language === 'ar' ? 'إدارة المحتوى' : 'Content Management',
      permissions: [
        { key: 'manage_hero_images', name: 'إدارة صور البطل', nameEn: 'Manage Hero Images' },
        { key: 'add_hero_images', name: 'إضافة صور البطل', nameEn: 'Add Hero Images' },
        { key: 'delete_hero_images', name: 'حذف صور البطل', nameEn: 'Delete Hero Images' },
        { key: 'edit_hero_images', name: 'تعديل صور البطل', nameEn: 'Edit Hero Images' },
        { key: 'manage_news', name: 'إدارة الأخبار', nameEn: 'Manage News' },
        { key: 'add_news', name: 'إضافة الأخبار', nameEn: 'Add News' },
        { key: 'edit_news', name: 'تعديل الأخبار', nameEn: 'Edit News' },
        { key: 'delete_news', name: 'حذف الأخبار', nameEn: 'Delete News' },
        { key: 'publish_news', name: 'نشر الأخبار', nameEn: 'Publish News' },
        { key: 'manage_achievements', name: 'إدارة الإنجازات', nameEn: 'Manage Achievements' },
        { key: 'add_achievements', name: 'إضافة الإنجازات', nameEn: 'Add Achievements' },
        { key: 'edit_achievements', name: 'تعديل الإنجازات', nameEn: 'Edit Achievements' },
        { key: 'delete_achievements', name: 'حذف الإنجازات', nameEn: 'Delete Achievements' },
        { key: 'manage_faqs', name: 'إدارة الأسئلة الشائعة', nameEn: 'Manage FAQs' },
        { key: 'add_faqs', name: 'إضافة الأسئلة الشائعة', nameEn: 'Add FAQs' },
        { key: 'edit_faqs', name: 'تعديل الأسئلة الشائعة', nameEn: 'Edit FAQs' },
        { key: 'delete_faqs', name: 'حذف الأسئلة الشائعة', nameEn: 'Delete FAQs' },
        { key: 'content_moderation', name: 'إشراف المحتوى', nameEn: 'Content Moderation' },
        { key: 'manage_media_files', name: 'إدارة الملفات الإعلامية', nameEn: 'Manage Media Files' },
        { key: 'auto_response_bot', name: 'روبوت الرد التلقائي', nameEn: 'Auto Response Bot' },
        { key: 'add_auto_response', name: 'إضافة رد تلقائي', nameEn: 'Add Auto Response' },
        { key: 'edit_auto_response', name: 'تعديل رد تلقائي', nameEn: 'Edit Auto Response' },
        { key: 'delete_auto_response', name: 'حذف رد تلقائي', nameEn: 'Delete Auto Response' }
      ]
    },
    {
      key: 'reports',
      name: language === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Statistics',
      permissions: [
        { key: 'manage_statistics', name: 'إدارة الإحصائيات', nameEn: 'Manage Statistics' },
        { key: 'view_statistics', name: 'عرض الإحصائيات', nameEn: 'View Statistics' },
        { key: 'generate_reports', name: 'إنشاء التقارير', nameEn: 'Generate Reports' },
        { key: 'export_pdf', name: 'تصدير PDF', nameEn: 'Export PDF' },
        { key: 'live_display_management', name: 'إدارة العرض المباشر', nameEn: 'Live Display Management' },
        { key: 'view_ratings', name: 'عرض التقييمات', nameEn: 'View Ratings' },
        { key: 'manage_ratings', name: 'إدارة التقييمات', nameEn: 'Manage Ratings' }
      ]
    },
    {
      key: 'operations',
      name: language === 'ar' ? 'العمليات' : 'Operations',
      permissions: [
        { key: 'view_requests', name: 'عرض الطلبات', nameEn: 'View Requests' },
        { key: 'process_requests', name: 'معالجة الطلبات', nameEn: 'Process Requests' },
        { key: 'send_notifications', name: 'إرسال الإشعارات', nameEn: 'Send Notifications' },
        { key: 'approve_services', name: 'اعتماد الخدمات', nameEn: 'Approve Services' },
        { key: 'service_availability', name: 'إتاحة الخدمات', nameEn: 'Service Availability' },
        { key: 'view_all_requests', name: 'عرض جميع الطلبات', nameEn: 'View All Requests' },
        { key: 'assign_requests', name: 'إسناد الطلبات', nameEn: 'Assign Requests' },
        { key: 'escalate_requests', name: 'تصعيد الطلبات', nameEn: 'Escalate Requests' },
        { key: 'request_new_service', name: 'طلب خدمة جديدة', nameEn: 'Request New Service' }
      ]
    },
    {
      key: 'medical',
      name: language === 'ar' ? 'الخدمات الطبية' : 'Medical Services',
      permissions: [
        { key: 'view_medical_records', name: 'عرض السجلات الطبية', nameEn: 'View Medical Records' },
        { key: 'provide_consultations', name: 'تقديم الاستشارات', nameEn: 'Provide Consultations' },
        { key: 'doctor_availability', name: 'إتاحة الطبيب', nameEn: 'Doctor Availability' }
      ]
    },
    {
      key: 'patient',
      name: language === 'ar' ? 'المرضى' : 'Patients',
      permissions: [
        { key: 'view_own_data', name: 'عرض البيانات الشخصية', nameEn: 'View Own Data' }, 
        { key: 'book_appointments', name: 'حجز المواعيد', nameEn: 'Book Appointments' }, 
        { key: 'request_services', name: 'طلب الخدمات', nameEn: 'Request Services' },
        { key: 'patient_request_service', name: 'طلب خدمة (للمرضى فقط)', nameEn: 'Service Request (Patients Only)' }
      ]
    },
    {
      key: 'system',
      name: language === 'ar' ? 'النظام' : 'System',
      permissions: [
        { key: 'full_system_access', name: 'الوصول الكامل للنظام', nameEn: 'Full System Access' },
        { key: 'database_management', name: 'إدارة قاعدة البيانات', nameEn: 'Database Management' },
        { key: 'security_center', name: 'مركز الأمان', nameEn: 'Security Center' },
        { key: 'system_monitoring', name: 'مراقبة النظام', nameEn: 'System Monitoring' },
        { key: 'audit_logs', name: 'سجلات التدقيق', nameEn: 'Audit Logs' },
        { key: 'advanced_settings', name: 'الإعدادات المتقدمة', nameEn: 'Advanced Settings' }
      ]
    }
  ];

  // تجميع جميع الصلاحيات في مصفوفة واحدة
  const allPermissions = permissionCategories.flatMap(category => category.permissions);

  const getRoleDisplay = (role: string) => {
    const roles = {
      'staff': language === 'ar' ? 'موظف' : 'Staff',
      'department_head': language === 'ar' ? 'رئيس قسم' : 'Department Head',
      'manager': language === 'ar' ? 'مدير منشأة' : 'Facility Manager',
      'supervisor': language === 'ar' ? 'مشرف النظام' : 'System Supervisor',
      'admin': language === 'ar' ? 'مسؤول النظام' : 'System Admin',
      'doctor': language === 'ar' ? 'طبيب' : 'Doctor'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'staff': 'bg-blue-100 text-blue-600',
      'department_head': 'bg-green-100 text-green-600',
      'manager': 'bg-purple-100 text-purple-600',
      'supervisor': 'bg-orange-100 text-orange-600',
      'admin': 'bg-red-100 text-red-600',
      'doctor': 'bg-teal-100 text-teal-600'
    };
    return colors[role] || 'bg-gray-100 text-gray-600';
  };

  // عرض قائمة الصلاحيات الممنوحة للمستخدم
  const handleShowPermissions = (userId: string) => {
    setShowPermissionsList(showPermissionsList === userId ? null : userId);
  };

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryKey)
        ? prev.filter(key => key !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const handleSavePermissions = () => {
    setShowConfirmation(true);
  };

  const confirmSavePermissions = () => {
    setShowConfirmation(false);
    setSuccessMessage(language === 'ar' ? 'تم حفظ الصلاحيات بنجاح' : 'Permissions saved successfully');
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
      setSelectedUser(null);
    }, 2000);
  };

  const [userPermissions, setUserPermissions] = useState<{[key: string]: boolean}>({});

  const handlePermissionChange = (permissionKey: string) => {
    setUserPermissions(prev => ({
      ...prev,
      [permissionKey]: !prev[permissionKey]
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('manage_permissions')}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' 
              ? 'إدارة صلاحيات المستخدمين والموظفين'
              : 'Manage user and staff permissions'
            }
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{language === 'ar' ? 'إضافة مستخدم' : 'Add User'}</span>
        </button>
      </div>
      
      {/* Show Hidden Elements Toggle */}
      {hasPermission('hide_elements') && (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-700 font-medium">
              {language === 'ar' ? 'العناصر المخفية لا تظهر للمستخدمين الآخرين' : 'Hidden elements are not visible to other users'}
            </span>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={() => setShowHidden(!showHidden)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-blue-700">
              {language === 'ar' ? 'إظهار المستخدمين المخفيين' : 'Show Hidden Users'}
            </span>
          </label>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-green-700">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'البحث في المستخدمين...' : 'Search users...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'المستخدم' : 'User'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الدور' : 'Role'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'المنشأة/القسم' : 'Facility/Department'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الصلاحيات' : 'Permissions'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <>
                <tr 
                  key={user.id} 
                  className={`hover:bg-gray-50 ${isElementHidden('user', user.id) ? 'bg-red-50/30' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.nationalId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getRoleColor(user.role)}`}>
                      {getRoleDisplay(user.role)}
                      {isElementHidden('user', user.id) && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                          {language === 'ar' ? 'مخفي' : 'Hidden'}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{user.facility}</div>
                    <div className="text-sm text-gray-500">{user.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {user.permissions.length} {language === 'ar' ? 'صلاحية' : 'permissions'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button 
                        onClick={() => handleShowPermissions(user.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={language === 'ar' ? 'عرض الصلاحيات' : 'View Permissions'}
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          const initialPermissions = {};
                          allPermissions.forEach(permission => {
                            initialPermissions[permission.key] = user.permissions.includes(permission.key);
                          });
                          setUserPermissions(initialPermissions);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={language === 'ar' ? 'تعديل' : 'Edit'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <HideElementButton
                        elementType="user"
                        elementId={user.id}
                        elementName={user.name}
                      />
                    </div>
                  </td>
                </tr>
                {showPermissionsList === user.id && (
                <tr className="bg-blue-50">
                  <td colSpan={5} className="px-6 py-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Info className="w-4 h-4 mr-2 text-blue-600" />
                        {language === 'ar' ? 'الصلاحيات الممنوحة' : 'Granted Permissions'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {user.permissions.map((permission, idx) => (
                          <div key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm">
                            {(() => {
                              // Find the permission details
                              for (const category of permissionCategories) {
                                const found = category.permissions.find(p => p.key === permission);
                                if (found) {
                                  return language === 'ar' ? found.name : found.nameEn;
                                }
                              }
                              return permission;
                            })()}
                          </div>
                        ))}
                        {user.permissions.length === 0 && (
                          <div className="text-gray-500 italic col-span-full">
                            {language === 'ar' ? 'لا توجد صلاحيات ممنوحة' : 'No permissions granted'}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
                )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Permissions Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'تعديل صلاحيات' : 'Edit Permissions'} - {selectedUser.name}
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    {language === 'ar' ? 'الاسم' : 'Name'}
                  </label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-gray-500" />
                    {language === 'ar' ? 'رقم الهوية' : 'National ID'}
                  </label>
                  <input
                    type="text"
                    value={selectedUser.nationalId}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Building className="w-4 h-4 mr-2 text-gray-500" />
                    {language === 'ar' ? 'المنشأة' : 'Facility'}
                  </label>
                  <input
                    type="text"
                    value={selectedUser.facility}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    {language === 'ar' ? 'القسم' : 'Department'}
                  </label>
                  <input
                    type="text"
                    value={selectedUser.department}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                {language === 'ar' ? 'الصلاحيات المتاحة' : 'Available Permissions'}
              </h3>
              
              <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissionCategories.map((category) => (
                  <div key={category.key} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div 
                      className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                      onClick={() => toggleCategory(category.key)}
                    >
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-gray-500 mr-3 rtl:ml-3 rtl:mr-0" />
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      </div>
                      {expandedCategories.includes(category.key) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    
                    {expandedCategories.includes(category.key) && (
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-1 gap-2">
                          {category.permissions.map((permission) => (
                            <div key={permission.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center">
                                <Shield className="w-5 h-5 text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {language === 'ar' ? permission.name : permission.nameEn}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {language === 'ar' ? permission.nameEn : permission.name}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {userPermissions[permission.key] || selectedUser.permissions.includes(permission.key) ? (
                                  <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                  <X className="w-5 h-5 text-red-600" />
                                )}
                                <input
                                  type="checkbox"
                                  checked={userPermissions[permission.key] || selectedUser.permissions.includes(permission.key)}
                                  onChange={() => handlePermissionChange(permission.key)}
                                  className="ml-3 rtl:mr-3 rtl:ml-0 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4 rtl:space-x-reverse">
              <button
                onClick={handleSavePermissions}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'إضافة مستخدم جديد' : 'Add New User'}
            </h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'رقم الهوية الوطنية' : 'National ID'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الدور' : 'Role'}
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="staff">{language === 'ar' ? 'موظف' : 'Staff'}</option>
                  <option value="department_head">{language === 'ar' ? 'رئيس قسم' : 'Department Head'}</option>
                  <option value="manager">{language === 'ar' ? 'مدير منشأة' : 'Facility Manager'}</option>
                  <option value="doctor">{language === 'ar' ? 'طبيب' : 'Doctor'}</option>
                  <option value="supervisor">{language === 'ar' ? 'مشرف النظام' : 'System Supervisor'}</option>
                </select>
              </div>
              
              <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {language === 'ar' ? 'إضافة' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          title={language === 'ar' ? 'تأكيد حفظ الصلاحيات' : 'Confirm Save Permissions'}
          message={language === 'ar' ? 'هل أنت متأكد من حفظ التغييرات؟' : 'Are you sure you want to save changes?'}
          type="info"
          onConfirm={confirmSavePermissions}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default PermissionsManagement;