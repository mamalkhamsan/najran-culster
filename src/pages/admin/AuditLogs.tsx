import React, { useState } from 'react';
import { FileText, Search, Filter, Calendar, User, Activity, Download, Eye, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const AuditLogs: React.FC = () => {
  const { language } = useLanguage();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showLogDetails, setShowLogDetails] = useState<string | null>(null);

  // بيانات تجريبية لسجلات التدقيق
  const auditLogs = [
    {
      id: '1',
      userId: 'admin-001',
      userName: 'مدير النظام الرئيسي',
      action: 'login',
      description: 'تسجيل دخول مدير النظام',
      descriptionEn: 'System admin login',
      timestamp: '2025-01-21T09:30:00',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      details: {
        browser: 'Chrome',
        os: 'Windows 10',
        device: 'Desktop',
        location: 'Najran, Saudi Arabia'
      }
    },
    {
      id: '2',
      userId: 'patient-001',
      userName: 'محمد سعد القحطاني',
      action: 'book_appointment',
      description: 'حجز موعد جديد',
      descriptionEn: 'New appointment booking',
      timestamp: '2025-01-21T10:15:00',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      details: {
        browser: 'Safari',
        os: 'iOS 16',
        device: 'Mobile',
        location: 'Najran, Saudi Arabia',
        appointmentId: 'APT-2025-001',
        appointmentDate: '2025-01-25T14:30:00',
        department: 'قسم الباطنة'
      }
    },
    {
      id: '3',
      userId: 'staff-001',
      userName: 'فاطمة علي أحمد',
      action: 'process_request',
      description: 'معالجة طلب خدمة',
      descriptionEn: 'Service request processing',
      timestamp: '2025-01-21T11:45:00',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      details: {
        browser: 'Chrome',
        os: 'macOS',
        device: 'Desktop',
        location: 'Najran, Saudi Arabia',
        requestId: 'REQ-2025-001',
        requestType: 'فحص مختبري',
        action: 'approve',
        notes: 'تمت الموافقة على الطلب'
      }
    },
    {
      id: '4',
      userId: 'news-manager-001',
      userName: 'سارة أحمد الزهراني',
      action: 'add_news',
      description: 'إضافة خبر جديد',
      descriptionEn: 'New news article added',
      timestamp: '2025-01-21T13:20:00',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      details: {
        browser: 'Chrome',
        os: 'Windows 10',
        device: 'Desktop',
        location: 'Najran, Saudi Arabia',
        newsId: 'NEWS-2025-001',
        newsTitle: 'افتتاح وحدة جديدة للعناية المركزة',
        action: 'create'
      }
    },
    {
      id: '5',
      userId: 'admin-002',
      userName: 'أحمد محمد السالم',
      action: 'update_settings',
      description: 'تحديث إعدادات النظام',
      descriptionEn: 'System settings update',
      timestamp: '2025-01-21T14:50:00',
      ipAddress: '192.168.1.104',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      details: {
        browser: 'Chrome',
        os: 'Windows 10',
        device: 'Desktop',
        location: 'Najran, Saudi Arabia',
        settingsChanged: ['email_notifications', 'session_timeout'],
        previousValues: {
          email_notifications: false,
          session_timeout: 15
        },
        newValues: {
          email_notifications: true,
          session_timeout: 30
        }
      }
    },
    {
      id: '6',
      userId: 'admin-001',
      userName: 'مدير النظام الرئيسي',
      action: 'hide_element',
      description: 'إخفاء عنصر',
      descriptionEn: 'Hide element',
      timestamp: '2025-01-21T15:30:00',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      details: {
        browser: 'Chrome',
        os: 'Windows 10',
        device: 'Desktop',
        location: 'Najran, Saudi Arabia',
        elementType: 'service',
        elementId: '3',
        elementName: 'عملية جراحية'
      }
    }
  ];

  const actionTypes = [
    { value: '', label: language === 'ar' ? 'جميع الإجراءات' : 'All Actions' },
    { value: 'login', label: language === 'ar' ? 'تسجيل الدخول' : 'Login' },
    { value: 'logout', label: language === 'ar' ? 'تسجيل الخروج' : 'Logout' },
    { value: 'book_appointment', label: language === 'ar' ? 'حجز موعد' : 'Book Appointment' },
    { value: 'process_request', label: language === 'ar' ? 'معالجة طلب' : 'Process Request' },
    { value: 'add_news', label: language === 'ar' ? 'إضافة خبر' : 'Add News' },
    { value: 'update_settings', label: language === 'ar' ? 'تحديث الإعدادات' : 'Update Settings' },
    { value: 'hide_element', label: language === 'ar' ? 'إخفاء عنصر' : 'Hide Element' },
    { value: 'unhide_element', label: language === 'ar' ? 'إظهار عنصر' : 'Unhide Element' }
  ];

  const users = [
    { value: '', label: language === 'ar' ? 'جميع المستخدمين' : 'All Users' },
    { value: 'admin-001', label: 'مدير النظام الرئيسي' },
    { value: 'admin-002', label: 'أحمد محمد السالم' },
    { value: 'patient-001', label: 'محمد سعد القحطاني' },
    { value: 'staff-001', label: 'فاطمة علي أحمد' },
    { value: 'news-manager-001', label: 'سارة أحمد الزهراني' }
  ];

  const filteredLogs = auditLogs.filter(log => 
    (searchTerm === '' || 
     log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.ipAddress.includes(searchTerm)) &&
    (selectedAction === '' || log.action === selectedAction) &&
    (selectedUser === '' || log.userId === selectedUser) &&
    (startDate === '' || new Date(log.timestamp) >= new Date(startDate)) &&
    (endDate === '' || new Date(log.timestamp) <= new Date(endDate))
  );

  const handleExportLogs = () => {
    alert(language === 'ar' ? 'تم تصدير السجلات بنجاح' : 'Logs exported successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
      case 'logout':
        return 'bg-blue-100 text-blue-600';
      case 'book_appointment':
        return 'bg-green-100 text-green-600';
      case 'process_request':
        return 'bg-purple-100 text-purple-600';
      case 'add_news':
      case 'edit_news':
      case 'delete_news':
        return 'bg-yellow-100 text-yellow-600';
      case 'update_settings':
        return 'bg-orange-100 text-orange-600';
      case 'hide_element':
        return 'bg-red-100 text-red-600';
      case 'unhide_element':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getActionDisplay = (action: string) => {
    const actionMap = {
      'login': language === 'ar' ? 'تسجيل دخول' : 'Login',
      'logout': language === 'ar' ? 'تسجيل خروج' : 'Logout',
      'book_appointment': language === 'ar' ? 'حجز موعد' : 'Book Appointment',
      'process_request': language === 'ar' ? 'معالجة طلب' : 'Process Request',
      'add_news': language === 'ar' ? 'إضافة خبر' : 'Add News',
      'edit_news': language === 'ar' ? 'تعديل خبر' : 'Edit News',
      'delete_news': language === 'ar' ? 'حذف خبر' : 'Delete News',
      'update_settings': language === 'ar' ? 'تحديث إعدادات' : 'Update Settings',
      'hide_element': language === 'ar' ? 'إخفاء عنصر' : 'Hide Element',
      'unhide_element': language === 'ar' ? 'إظهار عنصر' : 'Unhide Element'
    };
    
    return actionMap[action] || action;
  };

  // Check if user has permission to access this page
  if (!user || !hasPermission('audit_logs')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'غير مصرح' : 'Unauthorized'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ar' 
              ? 'ليس لديك صلاحية الوصول إلى سجلات التدقيق'
              : 'You do not have permission to access audit logs'
            }
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'ar' ? 'العودة' : 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'سجلات التدقيق' : 'Audit Logs'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' 
              ? 'عرض وتحليل سجلات نشاطات المستخدمين في النظام'
              : 'View and analyze user activity logs in the system'
            }
          </p>
        </div>
        <button
          onClick={handleExportLogs}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{language === 'ar' ? 'تصدير السجلات' : 'Export Logs'}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'ar' ? 'تصفية السجلات' : 'Filter Logs'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'بحث' : 'Search'}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'البحث في السجلات...' : 'Search logs...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الإجراء' : 'Action'}
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {actionTypes.map(action => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'المستخدم' : 'User'}
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {users.map(user => (
                <option key={user.value} value={user.value}>
                  {user.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'نطاق التاريخ' : 'Date Range'}
            </label>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'ar' ? 'من' : 'From'}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'ar' ? 'إلى' : 'To'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'المستخدم' : 'User'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الإجراء' : 'Action'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الوصف' : 'Description'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'التاريخ والوقت' : 'Timestamp'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'عنوان IP' : 'IP Address'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'التفاصيل' : 'Details'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="font-medium text-gray-900">{log.userName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getActionColor(log.action)}`}>
                      {getActionDisplay(log.action)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">
                      {language === 'ar' ? log.description : log.descriptionEn}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      <span>{formatDate(log.timestamp)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600">{log.ipAddress}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setShowLogDetails(log.id)}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{language === 'ar' ? 'عرض' : 'View'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg mt-6">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {language === 'ar' ? 'لا توجد سجلات' : 'No Logs Found'}
          </h3>
          <p className="text-gray-600">
            {language === 'ar' 
              ? 'لا توجد سجلات تطابق معايير البحث'
              : 'No logs match your search criteria'
            }
          </p>
        </div>
      )}

      {/* Log Details Modal */}
      {showLogDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
            {(() => {
              const log = auditLogs.find(l => l.id === showLogDetails);
              if (!log) return null;
              
              return (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {language === 'ar' ? 'تفاصيل السجل' : 'Log Details'}
                    </h2>
                    <button
                      onClick={() => setShowLogDetails(null)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'المستخدم' : 'User'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                          {log.userName}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'معرف المستخدم' : 'User ID'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                          {log.userId}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'الإجراء' : 'Action'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                          {getActionDisplay(log.action)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'التاريخ والوقت' : 'Timestamp'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                          {formatDate(log.timestamp)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ar' ? 'الوصف' : 'Description'}
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {language === 'ar' ? log.description : log.descriptionEn}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'عنوان IP' : 'IP Address'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                          {log.ipAddress}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'المتصفح/النظام' : 'Browser/System'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900 text-sm">
                          {log.details.browser} / {log.details.os} ({log.details.device})
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ar' ? 'تفاصيل إضافية' : 'Additional Details'}
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowLogDetails(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        {language === 'ar' ? 'إغلاق' : 'Close'}
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;