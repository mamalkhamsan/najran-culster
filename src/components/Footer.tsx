import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, HelpCircle, FileText, Shield, ExternalLink, Building } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  
  const handleHelpClick = () => {
    // Scroll to the chat section in the homepage
    navigate('/', { state: { scrollToChat: true } });
  };

  return (
    <footer style={{
      background: 'linear-gradient(90deg, hsla(213, 77%, 14%, 1) 0%, hsla(202, 27%, 45%, 1) 100%)'
    }} className="text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="text-center mb-6 md:mb-0">
            <div className="flex flex-col items-center justify-center">
              <div className="h-20 w-20 overflow-hidden flex items-center justify-center mb-4">
                <img 
                  src="/5 (1).png" 
                  alt="Najran Health Cluster Logo" 
                  className="h-20 w-20 object-contain rounded-full bg-white p-1"
                />
              </div>
              <h3 className="text-xl font-bold text-[#60A5FA] font-['JannaLT'] mb-2">
                {language === 'ar' ? 'تجمع نجران الصحي' : 'Najran Health Cluster'}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
                {language === 'ar' 
                  ? 'تجربة صحية رقمية متطورة تجمع بين الابتكار والرعاية الشخصية لخدمة أفضل وأسرع للمرضى والمراجعين'
                  : 'Advanced Digital Health Experience Combining Innovation and Personal Care for Better and Faster Service to Patients and Visitors'
                }
              </p>
              
                <strong>{language === 'ar' ? 'الهاتف:' : 'Phone:'}</strong> 9200
              <div className="flex space-x-4 rtl:space-x-reverse mt-6">
                <a
                  href="https://www.facebook.com/najranhealthcluster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://twitter.com/najranhealthcluster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://www.instagram.com/najranhealthcluster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Policies and Terms */}
          <div className="text-center mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4 text-[#60A5FA]">
              {language === 'ar' ? 'السياسات والشروط' : 'Policies & Terms'}
            </h4>
            <div className="space-y-3">
              <Link to="/terms" className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-gray-300 hover:text-white transition-colors group">
                <Shield className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                <span>{language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</span>
              </Link>
              <Link to="/privacy" className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-gray-300 hover:text-white transition-colors group">
                <Shield className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                <span>{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
              </Link>
              <Link to="/hospitals-contact" className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-gray-300 hover:text-white transition-colors group">
                <Building className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                <span>{language === 'ar' ? 'دليل المستشفيات' : 'Hospitals Directory'}</span>
              </Link>
              <Link to="/faq" className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-gray-300 hover:text-white transition-colors group">
                <FileText className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                <span>{language === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}</span>
              </Link>
              <button 
                onClick={handleHelpClick}
                className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-gray-300 hover:text-white transition-colors group w-full"
              >
                <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                <span>{language === 'ar' ? 'مساعدة' : 'Help'}</span>
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 text-[#60A5FA]">
              {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <Mail className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <a href="mailto:nj-ehealth-di@moh.gov.sa" className="text-gray-300 hover:text-white transition-colors">
                  nj-ehealth-di@moh.gov.sa
                </a>
              </div>
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <Phone className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <a href="tel:0545048999" className="text-gray-300 hover:text-white transition-colors">
                  9200
                </a>
              </div>
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <MapPin className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <span className="text-gray-300">
                  {language === 'ar' ? 'نجران، السعودية' : 'Najran, Saudi Arabia'}
                </span>
              </div>
              <a 
                href="https://najran.moh.gov.sa" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-gray-300 hover:text-white transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <span>{language === 'ar' ? 'الموقع الرسمي' : 'Official Website'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-10 pt-6 text-center text-gray-300">
          <p className="text-sm mb-2">
            © {new Date().getFullYear()} {t('rights_reserved')} - {language === 'ar' ? 'تجمع نجران الصحي' : 'Najran Health Cluster'}
          </p>
          <p className="text-sm mt-1">
            {language === 'ar' ? 'الإدارة التنفيذية للصحة الرقمية - إدارة حلول الأعمال' : 'Digital Health Executive Department - Business Solutions Department'}
          </p>
          <div className="mt-4 flex justify-center space-x-4 rtl:space-x-reverse text-xs text-gray-400">
            <Link to="/about" className="hover:text-white transition-colors">
              {t('about')}
            </Link>
            <span>•</span>
            <Link to="/hospitals-contact" className="hover:text-white transition-colors">
              {language === 'ar' ? 'دليل المستشفيات' : 'Hospitals Directory'}
            </Link>
            <span>•</span>
            <Link to="/news" className="hover:text-white transition-colors">
              {t('news')}
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              {t('contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;