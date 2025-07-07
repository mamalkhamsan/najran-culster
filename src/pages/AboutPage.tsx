import React from 'react';
import { Heart, Users, Award, Target, Star, Zap, Shield, Globe, Briefcase, Building, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import BackButton from '../components/BackButton';

const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Hero Section with Background Image */}
        <section className="relative py-10 md:py-16 overflow-hidden border-b border-gray-200" 
          style={{
            background: 'linear-gradient(90deg, hsla(213, 77%, 14%, 1) 0%, hsla(213, 77%, 14%, 1) 60%, hsla(0, 0%, 100%, 1) 100%)'
          }}>
          {/* Background with very light opacity */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative z-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white font-jnanalt">
                {t('about')}
              </h1>
              <p className="text-lg leading-relaxed max-w-2xl mx-auto text-white">
                {language === 'ar' 
                  ? 'تجمع نجران الصحي هو إحدى التجمعات الرائدة في تقديم الخدمات الصحية المتميزة في منطقة نجران، حيث نسعى لتحقيق أعلى معايير الجودة والتميز في الرعاية الصحية'
                  : 'Najran Health Cluster is one of the leading institutions in providing distinguished health services in the Najran region, where we strive to achieve the highest standards of quality and excellence in healthcare'
                }
              </p>
              <div className="w-24 h-1 bg-white/50 rounded-full mx-auto mt-6"></div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="relative -mt-12 z-20 mb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right rtl:text-left">
                    <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
                    <span className="text-xs text-green-500">+12%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">15</div>
                <div className="text-gray-600 text-sm mb-2">{t('facilities')}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#1e3a8a] h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">85% {language === 'ar' ? 'معدل التشغيل' : 'Utilization'}</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right rtl:text-left">
                    <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
                    <span className="text-xs text-green-500">+8%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">89</div>
                <div className="text-gray-600 text-sm mb-2">{t('health_centers')}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#1e3a8a] h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">92% {language === 'ar' ? 'من الهدف' : 'of target'}</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right rtl:text-left">
                    <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
                    <span className="text-xs text-green-500">+15%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">45</div>
                <div className="text-gray-600 text-sm mb-2">{t('departments')}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#1e3a8a] h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">96% {language === 'ar' ? 'من الهدف' : 'of target'}</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right rtl:text-left">
                    <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
                    <span className="text-xs text-green-500">+15%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">96%</div>
                <div className="text-gray-600 text-sm mb-2">{language === 'ar' ? 'معدل الرضا' : 'Satisfaction Rate'}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#1e3a8a] h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'تقييم ممتاز' : 'Excellent Rating'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="py-16">
          <div className="text-center mb-12">
            <div className="ecg-title-container">
              <div className="ecg-line ecg-line-left" style={{ width: '20%' }}></div>
              <h2 className="text-2xl font-bold text-blue-600 mb-3 font-decotype-naskh ecg-title">
                {language === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Vision & Mission'}
              </h2>
              <div className="ecg-line ecg-line-right" style={{ width: '20%' }}></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-calibri">
              {language === 'ar' 
                ? 'نسعى لتحقيق التميز في الرعاية الصحية من خلال رؤية واضحة ورسالة هادفة'
                : 'We strive for excellence in healthcare through a clear vision and purposeful mission'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group bg-[#1e3a8a] text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-3 font-decotype-naskh">
                  {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {language === 'ar'
                    ? 'أن نكون الخيار الأول والأمثل في تقديم الخدمات الصحية الرقمية المتطورة والمتكاملة التي تحقق أعلى معايير الجودة والسلامة للمرضى والمراجعين في منطقة نجران'
                    : 'To be the first and optimal choice in providing advanced and integrated digital health services that achieve the highest standards of quality and safety for patients and visitors in the Najran region'
                  }
                </p>
                
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {['الجودة', 'التكامل', 'الابتكار', 'السلامة'].map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                      {language === 'ar' ? tag : ['Quality', 'Integration', 'Innovation', 'Safety'][index]}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Floating particles for visual effect */}
              <div className="floating-particle" style={{ top: '10%', left: '10%' }}></div>
              <div className="floating-particle" style={{ top: '20%', right: '15%' }}></div>
              <div className="floating-particle" style={{ bottom: '30%', left: '20%' }}></div>
              <div className="floating-particle" style={{ bottom: '15%', right: '10%' }}></div>
            </div>

            <div className="group bg-[#1e3a8a] text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-3 font-decotype-naskh">
                  {language === 'ar' ? 'رسالتنا' : 'Our Mission'}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {language === 'ar'
                    ? 'تقديم خدمات صحية متميزة ومتكاملة من خلال استخدام أحدث التقنيات الرقمية والممارسات الطبية المتقدمة، مع التركيز على تحسين تجربة المريض وضمان الوصول السهل والآمن للخدمات الصحية'
                    : 'Providing distinguished and integrated health services through the use of the latest digital technologies and advanced medical practices, focusing on improving patient experience and ensuring easy and safe access to health services'
                  }
                </p>
                
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {['التميز', 'الرعاية', 'التقنية', 'سهولة الوصول'].map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                      {language === 'ar' ? tag : ['Excellence', 'Care', 'Technology', 'Accessibility'][index]}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Floating particles for visual effect */}
              <div className="floating-particle" style={{ top: '50%', left: '5%' }}></div>
              <div className="floating-particle" style={{ top: '70%', right: '5%' }}></div>
              <div className="floating-particle" style={{ top: '10%', right: '10%' }}></div>
              <div className="floating-particle" style={{ bottom: '20%', left: '15%' }}></div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 bg-gray-50">
          <div className="text-center mb-12">
            <div className="ecg-title-container">
              <div className="ecg-line ecg-line-left" style={{ width: '20%' }}></div>
              <h2 className="text-2xl font-bold text-blue-600 mb-3 font-decotype-naskh ecg-title">
                {language === 'ar' ? 'قيمنا' : 'Our Values'}
              </h2>
              <div className="ecg-line ecg-line-right" style={{ width: '20%' }}></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-calibri">
              {language === 'ar' 
                ? 'القيم التي توجه عملنا وتحدد هويتنا في تقديم الرعاية الصحية'
                : 'The values that guide our work and define our identity in providing healthcare'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-[#1e3a8a] text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 font-decotype-naskh">
                  {language === 'ar' ? 'التميز' : 'Excellence'}
                </h3>
                <p className="text-white/80">
                  {language === 'ar'
                    ? 'نسعى للتميز في جميع جوانب خدماتنا الصحية ونلتزم بتحقيق أعلى معايير الجودة في كل ما نقدمه'
                    : 'We strive for excellence in all aspects of our health services and commit to achieving the highest quality standards in everything we provide'
                  }
                </p>
              </div>
            </div>

            <div className="group bg-[#1e3a8a] text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 font-decotype-naskh">
                  {language === 'ar' ? 'الرعاية المتمحورة حول المريض' : 'Patient-Centered Care'}
                </h3>
                <p className="text-white/80">
                  {language === 'ar'
                    ? 'نضع المريض في مركز اهتماماتنا وقراراتنا ونصمم خدماتنا لتلبية احتياجاتهم وتوقعاتهم'
                    : 'We put the patient at the center of our concerns and decisions and design our services to meet their needs and expectations'
                  }
                </p>
              </div>
            </div>

            <div className="group bg-[#1e3a8a] text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 font-decotype-naskh">
                  {language === 'ar' ? 'الرحمة والعطف' : 'Compassion'}
                </h3>
                <p className="text-white/80">
                  {language === 'ar'
                    ? 'نقدم خدماتنا بروح من الرحمة والعطف والإنسانية ونتعامل مع المرضى باحترام وكرامة'
                    : 'We provide our services with a spirit of compassion and humanity and treat patients with respect and dignity'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Values */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-[#1e3a8a] text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3 font-decotype-naskh">
                    {language === 'ar' ? 'الابتكار' : 'Innovation'}
                  </h3>
                  <p className="text-white/80">
                    {language === 'ar'
                      ? 'نتبنى أحدث التقنيات والحلول المبتكرة لتحسين جودة الرعاية الصحية وتجربة المرضى'
                      : 'We adopt the latest technologies and innovative solutions to improve the quality of healthcare and patient experience'
                    }
                  </p>
                </div>
              </div>

              <div className="group bg-[#1e3a8a] text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3 font-decotype-naskh">
                    {language === 'ar' ? 'الأمان والخصوصية' : 'Security & Privacy'}
                  </h3>
                  <p className="text-white/80">
                    {language === 'ar'
                      ? 'نحافظ على أمان وخصوصية بيانات المرضى ونلتزم بأعلى معايير الحماية والسرية'
                      : 'We maintain the security and privacy of patient data and adhere to the highest standards of protection and confidentiality'
                    }
                  </p>
                </div>
              </div>

              <div className="group bg-[#1e3a8a] text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3 font-decotype-naskh">
                    {language === 'ar' ? 'الوصول الشامل' : 'Universal Access'}
                  </h3>
                  <p className="text-white/80">
                    {language === 'ar'
                      ? 'نضمن وصول الخدمات لجميع أفراد المجتمع بغض النظر عن موقعهم أو ظروفهم'
                      : 'We ensure services reach all members of the community regardless of their location or circumstances'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-8 mb-8 text-white rounded-xl shadow-lg" style={{ background: 'linear-gradient(90deg, hsla(213, 77%, 14%, 1) 0%, hsla(213, 77%, 14%, 1) 60%, hsla(0, 0%, 100%, 1) 100%)' }}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl font-bold mb-3 font-decotype-naskh">
              {language === 'ar' ? 'انضم إلينا في رحلة التميز الصحي' : 'Join Us in the Journey of Healthcare Excellence'}
            </h2>
            <p className="text-base text-blue-100 mb-4 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'نسعى دائماً لتقديم أفضل الخدمات الصحية وتحسين تجربة المرضى والمراجعين'
                : 'We always strive to provide the best health services and improve the experience of patients and visitors'
              }
            </p>
            <Link 
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg"
            >
              {language === 'ar' ? 'انضم إلينا اليوم' : 'Join Us Today'}
              {language === 'ar' ? <ArrowLeft className="mr-2 w-5 h-5" /> : <ArrowRight className="ml-2 w-5 h-5" />}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;