import React, { useState } from 'react';
import { Settings, Database, Shield, Server, Save, RefreshCw, Download, Upload, AlertTriangle, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdvancedSettings: React.FC = () => {
  const { language } = useLanguage();
  const { user, hasPermission } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<{
    type: 'save' | 'backup' | 'restore' | 'optimize';
    title: string;
    message: string;
  } | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveSettings = () => {
    setConfirmationAction({
      type: 'save',
      title: language === 'ar' ? 'تأكيد حفظ الإعدادات المتقدمة' : 'Confirm Save Advanced Settings',
      message: language === 'ar' 
        ? 'هل أنت متأكد من حفظ الإعدادات المتقدمة؟ قد يؤثر هذا على أداء النظام.'
        : 'Are you sure you want to save advanced settings? This may affect system performance.'
    });
    setShowConfirmation(true);
  };

  const handleBackupDatabase = () => {
    setConfirmationAction({
      type: 'backup',
      title: language === 'ar' ? 'تأكيد النسخ الاحتياطي' : 'Confirm Database Backup',
      message: language === 'ar' 
        ? 'هل تريد إنشاء نسخة احتياطية من قاعدة البيانات؟'
        : 'Do you want to create a database backup?'
    });
    setShowConfirmation(true);
  };

  const handleRestoreDatabase = () => {
    setConfirmationAction({
      type: 'restore',
      title: language === 'ar' ? 'تأكيد استعادة قاعدة البيانات' : 'Confirm Database Restore',
      message: language === 'ar' 
        ? 'تحذير: سيؤدي هذا إلى استبدال البيانات الحالية. هل أنت متأكد من المتابعة؟'
        : 'Warning: This will replace current data. Are you sure you want to proceed?'
    });
    setShowConfirmation(true);
  };

  const handleOptimizeDatabase = () => {
    setConfirmationAction({
      type: 'optimize',
      title: language === 'ar' ? 'تأكيد تحسين قاعدة البيانات' : 'Confirm Database Optimization',
      message: language === 'ar' 
        ? 'هل تريد تحسين أداء قاعدة البيانات؟ قد يستغرق هذا بعض الوقت.'
        : 'Do you want to optimize database performance? This may take some time.'
    });
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    if (!confirmationAction) return;
    
    let message = '';
    switch (confirmationAction.type) {
      case 'save':
        message = language === 'ar' ? 'تم حفظ الإعدادات المتقدمة بنجاح' : 'Advanced settings saved successfully';
        break;
      case 'backup':
        message = language === 'ar' ? 'تم إنشاء نسخة احتياطية من قاعدة البيانات بنجاح' : 'Database backup created successfully';
        break;
      case 'restore':
        message = language === 'ar' ? 'تم استعادة قاعدة البيانات بنجاح' : 'Database restored successfully';
        break;
      case 'optimize':
        message = language === 'ar' ? 'تم تحسين أداء قاعدة البيانات بنجاح' : 'Database optimized successfully';
        break;
    }
    
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setShowConfirmation(false);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Check if user exists and has permission
  if (!user || !hasPermission('advanced_settings')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'غير مصرح' : 'Unauthorized'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ar' 
              ? 'ليس لديك صلاحية الوصول إلى الإعدادات المتقدمة'
              : 'You do not have permission to access advanced settings'
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'ar' ? 'الإعدادات المتقدمة' : 'Advanced Settings'}
        </h1>
        <p className="text-gray-600">
          {language === 'ar' 
            ? 'إعدادات متقدمة للنظام وقاعدة البيانات'
            : 'Advanced settings for system and database'
          }
        </p>
      </div>

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

      {/* Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              {language === 'ar' 
                ? 'تحذير: هذه الإعدادات متقدمة وقد تؤثر على أداء واستقرار النظام. يرجى توخي الحذر عند إجراء التغييرات.'
                : 'Warning: These are advanced settings and may affect system performance and stability. Please use caution when making changes.'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* System Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إعدادات النظام المتقدمة' : 'Advanced System Settings'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'ar' ? 'تكوين متقدم لأداء النظام' : 'Advanced configuration for system performance'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'حجم ذاكرة التخزين المؤقت (ميجابايت)' : 'Cache Size (MB)'}
              </label>
              <input
                type="number"
                defaultValue="256"
                min="64"
                max="1024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الحد الأقصى للاتصالات المتزامنة' : 'Max Concurrent Connections'}
              </label>
              <input
                type="number"
                defaultValue="100"
                min="10"
                max="500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'مهلة الجلسة (دقائق)' : 'Session Timeout (minutes)'}
              </label>
              <input
                type="number"
                defaultValue="30"
                min="5"
                max="120"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'ar' ? 'تمكين تسجيل الأداء المفصل' : 'Enable detailed performance logging'}
                </span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'ar' ? 'تمكين ضغط الاستجابة' : 'Enable response compression'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إعدادات قاعدة البيانات المتقدمة' : 'Advanced Database Settings'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'ar' ? 'تكوين متقدم لأداء قاعدة البيانات' : 'Advanced configuration for database performance'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'حجم مجمع الاتصال' : 'Connection Pool Size'}
              </label>
              <input
                type="number"
                defaultValue="20"
                min="5"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'مهلة الاستعلام (ثواني)' : 'Query Timeout (seconds)'}
              </label>
              <input
                type="number"
                defaultValue="30"
                min="5"
                max="120"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'فاصل النسخ الاحتياطي التلقائي (ساعات)' : 'Auto Backup Interval (hours)'}
              </label>
              <input
                type="number"
                defaultValue="24"
                min="1"
                max="168"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'ar' ? 'تمكين التنظيف التلقائي للبيانات القديمة' : 'Enable automatic cleanup of old data'}
                </span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'عمر البيانات للتنظيف (أيام)' : 'Data Age for Cleanup (days)'}
              </label>
              <input
                type="number"
                defaultValue="365"
                min="30"
                max="1095"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إعدادات الأمان المتقدمة' : 'Advanced Security Settings'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'ar' ? 'تكوين متقدم لأمان النظام' : 'Advanced configuration for system security'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الحد الأقصى لمحاولات تسجيل الدخول' : 'Max Login Attempts'}
              </label>
              <input
                type="number"
                defaultValue="5"
                min="3"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'مدة قفل الحساب (دقائق)' : 'Account Lockout Duration (minutes)'}
              </label>
              <input
                type="number"
                defaultValue="30"
                min="5"
                max="120"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'مستوى تعقيد كلمة المرور' : 'Password Complexity Level'}
              </label>
              <select
                defaultValue="medium"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">{language === 'ar' ? 'منخفض' : 'Low'}</option>
                <option value="medium">{language === 'ar' ? 'متوسط' : 'Medium'}</option>
                <option value="high">{language === 'ar' ? 'عالي' : 'High'}</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'ar' ? 'تمكين تسجيل محاولات الوصول الفاشلة' : 'Enable logging of failed access attempts'}
                </span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'ar' ? 'فرض المصادقة الثنائية للمسؤولين' : 'Enforce two-factor authentication for admins'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Server Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <Server className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إعدادات الخادم المتقدمة' : 'Advanced Server Settings'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'ar' ? 'تكوين متقدم لأداء الخادم' : 'Advanced configuration for server performance'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'عدد عمليات العمل' : 'Number of Workers'}
              </label>
              <input
                type="number"
                defaultValue="4"
                min="1"
                max="16"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الحد الأقصى لحجم الطلب (ميجابايت)' : 'Max Request Size (MB)'}
              </label>
              <input
                type="number"
                defaultValue="10"
                min="1"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'مهلة الطلب (ثواني)' : 'Request Timeout (seconds)'}
              </label>
              <input
                type="number"
                defaultValue="60"
                min="10"
                max="300"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'ar' ? 'تمكين تخزين مؤقت للمحتوى الثابت' : 'Enable static content caching'}
                </span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'ar' ? 'تمكين ضغط GZIP' : 'Enable GZIP compression'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Database Maintenance */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
            <Database className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'صيانة قاعدة البيانات' : 'Database Maintenance'}
            </h2>
            <p className="text-sm text-gray-500">
              {language === 'ar' ? 'عمليات صيانة وإدارة قاعدة البيانات' : 'Database maintenance and management operations'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleBackupDatabase}
            className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Download className="w-8 h-8 text-blue-600 mb-3" />
            <span className="font-medium text-blue-700">
              {language === 'ar' ? 'نسخ احتياطي' : 'Backup Database'}
            </span>
          </button>
          
          <button
            onClick={handleRestoreDatabase}
            className="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors"
          >
            <Upload className="w-8 h-8 text-yellow-600 mb-3" />
            <span className="font-medium text-yellow-700">
              {language === 'ar' ? 'استعادة من نسخة' : 'Restore Database'}
            </span>
          </button>
          
          <button
            onClick={handleOptimizeDatabase}
            className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
          >
            <RefreshCw className="w-8 h-8 text-green-600 mb-3" />
            <span className="font-medium text-green-700">
              {language === 'ar' ? 'تحسين الأداء' : 'Optimize Performance'}
            </span>
          </button>
          
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 flex items-center justify-center mb-3">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
            <span className="font-medium text-gray-700">
              {language === 'ar' ? 'آخر تحسين: منذ 3 أيام' : 'Last optimization: 3 days ago'}
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={handleSaveSettings}
          className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>{language === 'ar' ? 'حفظ الإعدادات المتقدمة' : 'Save Advanced Settings'}</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && confirmationAction && (
        <ConfirmationModal
          isOpen={showConfirmation}
          title={confirmationAction.title}
          message={confirmationAction.message}
          type={confirmationAction.type === 'restore' ? 'warning' : 'info'}
          onConfirm={confirmAction}
          onCancel={() => {
            setShowConfirmation(false);
            setConfirmationAction(null);
          }}
        />
      )}
    </div>
  );
};

export default AdvancedSettings;