import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface BackButtonProps {
  showHome?: boolean;
  customPath?: string;
  className?: string;
  centered?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  showHome = false, 
  customPath,
  className = "mb-6",
  centered = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const handleBack = () => {
    if (customPath) {
      navigate(customPath);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  if (isHomePage && !showHome) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-3 rtl:space-x-reverse ${className} ${centered ? 'justify-center' : ''}`}>
      <div className="flex items-center space-x-3 rtl:space-x-reverse bg-white rounded-full shadow-md p-1">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-[#1e3a8a] hover:bg-blue-50 rounded-full transition-colors"
        >
          {language === 'ar' ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <ArrowLeft className="w-4 h-4" />
          )}
          <span className="font-medium">{language === 'ar' ? 'رجوع' : 'Back'}</span>
        </button>
        
        {showHome && !isHomePage && (
          <>
            <div className="h-6 w-px bg-gray-300"></div>
            <button
              onClick={handleHome}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-[#1e3a8a] hover:bg-blue-50 rounded-full transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BackButton;