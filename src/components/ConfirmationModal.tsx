import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'success' | 'error' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  type = 'warning',
  onConfirm,
  onCancel
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const getIconByType = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <X className="w-12 h-12 text-red-500" />;
      case 'info':
        return <AlertCircle className="w-12 h-12 text-blue-500" />;
      case 'warning':
      default:
        return <AlertCircle className="w-12 h-12 text-yellow-500" />;
    }
  };

  const getButtonColorByType = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'warning':
      default:
        return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          {getIconByType()}
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
            {title}
          </h2>
          <p className="text-gray-600">
            {message}
          </p>
        </div>
        
        <div className="flex space-x-4 rtl:space-x-reverse">
          <button
            onClick={onConfirm}
            className={`flex-1 ${getButtonColorByType()} text-white py-3 rounded-lg font-semibold transition-colors`}
          >
            {confirmText || (language === 'ar' ? 'تأكيد' : 'Confirm')}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            {cancelText || (language === 'ar' ? 'إلغاء' : 'Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;