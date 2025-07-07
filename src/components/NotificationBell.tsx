import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Eye, Trash2, CheckCircle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useNotifications();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowAllNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setShowAllNotifications(false);
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  const handleViewAllNotifications = () => {
    setShowAllNotifications(true);
  };

  const handleMarkAllAsRead = () => {
    if (confirm(language === 'ar' ? 'هل تريد تعيين جميع الإشعارات كمقروءة؟' : 'Mark all notifications as read?')) {
      markAllAsRead();
    }
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(language === 'ar' ? 'هل تريد حذف هذا الإشعار؟' : 'Delete this notification?')) {
      deleteNotification(id);
    }
  };

  const handleClearAll = () => {
    if (confirm(language === 'ar' ? 'هل تريد حذف جميع الإشعارات؟' : 'Clear all notifications?')) {
      clearAllNotifications();
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return language === 'ar' 
        ? `منذ ${diffMins} دقيقة` 
        : `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return language === 'ar' 
        ? `منذ ${diffHours} ساعة` 
        : `${diffHours} hours ago`;
    } else {
      return language === 'ar' 
        ? `منذ ${diffDays} يوم` 
        : `${diffDays} days ago`;
    }
  };

  const displayedNotifications = showAllNotifications ? notifications : notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg z-50 overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <div className="flex space-x-2 rtl:space-x-reverse">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {language === 'ar' ? 'تعيين الكل كمقروء' : 'Mark all read'}
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-red-600 hover:text-red-800 flex items-center"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    {language === 'ar' ? 'حذف الكل' : 'Clear all'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {displayedNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {displayedNotifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer relative group ${notification.isRead ? '' : 'bg-blue-50'}`}
                  >
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationTypeColor(notification.type)}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                            <button
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded-full transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        {!notification.isRead && (
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>{language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
              </div>
            )}
          </div>

          {notifications.length > 5 && !showAllNotifications && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button 
                onClick={handleViewAllNotifications}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center w-full"
              >
                <Eye className="w-4 h-4 mr-1" />
                {language === 'ar' ? `عرض جميع الإشعارات (${notifications.length})` : `View all notifications (${notifications.length})`}
              </button>
            </div>
          )}

          {showAllNotifications && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button 
                onClick={() => setShowAllNotifications(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {language === 'ar' ? 'عرض أقل' : 'Show less'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;