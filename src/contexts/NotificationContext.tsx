import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  relatedId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // بيانات تجريبية للإشعارات
  useEffect(() => {
    if (user) {
      const demoNotifications: Notification[] = [
        {
          id: '1',
          title: language === 'ar' ? 'تم استلام طلبك' : 'Request Received',
          message: language === 'ar' ? 'تم استلام طلب الخدمة الخاص بك وهو قيد المراجعة' : 'Your service request has been received and is under review',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          type: 'info',
          isRead: false,
          relatedId: 'REQ-2025-001'
        },
        {
          id: '2',
          title: language === 'ar' ? 'تم الموافقة على طلبك' : 'Request Approved',
          message: language === 'ar' ? 'تم الموافقة على طلب الفحص المختبري' : 'Your laboratory test request has been approved',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          type: 'success',
          isRead: true,
          relatedId: 'REQ-2025-002'
        },
        {
          id: '3',
          title: language === 'ar' ? 'تذكير بموعد' : 'Appointment Reminder',
          message: language === 'ar' ? 'لديك موعد غداً في تمام الساعة 10:00 صباحاً' : 'You have an appointment tomorrow at 10:00 AM',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          type: 'warning',
          isRead: false
        },
        {
          id: '4',
          title: language === 'ar' ? 'نتائج الفحص جاهزة' : 'Test Results Ready',
          message: language === 'ar' ? 'نتائج فحص الدم متاحة الآن في محفظة المستندات' : 'Blood test results are now available in your documents',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          type: 'success',
          isRead: false
        },
        {
          id: '5',
          title: language === 'ar' ? 'تحديث النظام' : 'System Update',
          message: language === 'ar' ? 'تم تحديث النظام بميزات جديدة' : 'System has been updated with new features',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          type: 'info',
          isRead: true
        },
        {
          id: '6',
          title: language === 'ar' ? 'طلب مرفوض' : 'Request Rejected',
          message: language === 'ar' ? 'تم رفض طلب الخدمة لعدم اكتمال البيانات' : 'Service request rejected due to incomplete data',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          type: 'error',
          isRead: false
        }
      ];
      
      setNotifications(demoNotifications);
    } else {
      setNotifications([]);
    }
  }, [user, language]);

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // إظهار إشعار المتصفح إذا كان مدعوماً
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/5 copy copy.png'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // طلب إذن الإشعارات
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider 
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};