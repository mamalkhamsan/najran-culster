import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'statistics', path: '/statistics' },
    { key: 'news', path: '/news' },
    { key: 'platform', path: '/digital-services' },
    { key: 'contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50" style={{
      background: 'linear-gradient(90deg, hsla(213, 77%, 14%, 1) 0%, hsla(213, 77%, 14%, 1) 60%, hsla(0, 0%, 100%, 1) 100%)'
    }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex items-center">
              <div className="h-16 w-16 overflow-hidden flex items-center justify-center">
                <img 
                  src="/5 (1).png" 
                  alt="Najran Health Cluster Logo" 
                  className="h-16 w-16 object-contain rounded-full"
                />
              </div>
              <div className="ml-3 rtl:mr-3 rtl:ml-0">
                <h1 className="text-xl font-bold text-[#60A5FA] font-calibri" style={{
                  textShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                }}>
                  <span className="text-blue-600 text-lg">{language === 'ar' ? 'تجمع نجران الصحي' : 'Najran Health Cluster'}</span>
                </h1>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className="text-white hover:text-blue-200 font-medium transition-colors duration-200"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'ar' ? 'EN' : 'ع'}</span>
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <NotificationBell />
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Link
                  to="/platform/dashboard"
                  className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-white hover:text-red-200 transition-colors hover:bg-white/10 rounded-full"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;