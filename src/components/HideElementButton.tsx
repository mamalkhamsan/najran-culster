import React, { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ConfirmationModal from './ConfirmationModal';

interface HideElementButtonProps {
  elementType: string;
  elementId: string;
  elementName: string;
  className?: string;
}

const HideElementButton: React.FC<HideElementButtonProps> = ({
  elementType,
  elementId,
  elementName,
  className = ''
}) => {
  const { hasPermission, hideElement, unhideElement, isElementHidden } = useAuth();
  const { language } = useLanguage();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isHidden, setIsHidden] = useState<boolean>(isElementHidden(elementType, elementId));

  // التحقق من صلاحية إخفاء العناصر
  if (!hasPermission('hide_elements')) {
    return null;
  }

  const handleToggleHide = () => {
    setShowConfirmation(true);
  };

  const confirmToggleHide = () => {
    const newHiddenState = !isHidden;
    
    if (newHiddenState) {
      hideElement(elementType, elementId, elementName);
    } else {
      unhideElement(elementType, elementId);
    }
    
    setIsHidden(newHiddenState);
    setShowConfirmation(false);
  };

  return (
    <>
      <button
        onClick={handleToggleHide} 
        className={`p-2 ${isHidden ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'} rounded-lg transition-colors ${className}`}
        title={isHidden ? (language === 'ar' ? 'إظهار العنصر' : 'Show Element') : (language === 'ar' ? 'إخفاء العنصر' : 'Hide Element')}
      >
        {isHidden ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          title={isHidden 
            ? (language === 'ar' ? 'تأكيد إظهار العنصر' : 'Confirm Show Element') 
            : (language === 'ar' ? 'تأكيد إخفاء العنصر' : 'Confirm Hide Element')}
          message={isHidden ? 
            (language === 'ar' ? `هل أنت متأكد من إظهار "${elementName}"؟` : `Are you sure you want to show "${elementName}"?`) : 
            (language === 'ar' ? `هل أنت متأكد من إخفاء "${elementName}"؟ سيتم إخفاء هذا العنصر من جميع القوائم والعروض.` : `Are you sure you want to hide "${elementName}"? This element will be hidden from all menus and displays.`)}
          type="warning"
          onConfirm={confirmToggleHide}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
};

export default HideElementButton;