import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Save, Image, HelpCircle, Eye, EyeOff, Download, MessageSquare, Check, X, Award, Calendar, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const ContentManagement: React.FC = () => {
  const { language, t } = useLanguage();
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('hero_images');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    category: '',
    isActive: true,
    autoResponse: false
  });

  const tabs = [
    { 
      key: 'hero_images', 
      icon: Image, 
      name: language === 'ar' ? 'صور البطل' : 'Hero Images',
      permission: 'manage_hero_images'
    },
    { 
      key: 'news', 
      icon: Calendar, 
      name: language === 'ar' ? 'الأخبار' : 'News',
      permission: 'manage_news'
    },
    { 
      key: 'achievements', 
      icon: Award, 
      name: language === 'ar' ? 'الإنجازات' : 'Achievements',
      permission: 'manage_achievements'
    },
    { 
      key: 'faqs', 
      icon: HelpCircle, 
      name: language === 'ar' ? 'الأسئلة الشائعة' : 'FAQs',
      permission: 'manage_faqs'
    },
    { 
      key: 'auto-response', 
      icon: MessageSquare, 
      name: language === 'ar' ? 'الرد التلقائي' : 'Auto Response',
      permission: 'auto_response_bot'
    }
  ];

  // بيانات تجريبية لصور البطل
  const [heroImages, setHeroImages] = useState([
    {
      id: '1',
      title: 'صورة البطل الرئيسية',
      titleEn: 'Main Hero Image',
      imageUrl: '/3bdb653c-3f39-43eb-943f-22da6e80b8f7.jfif',
      displayOrder: 1,
      isActive: true
    },
    {
      id: '2',
      title: 'فريق طبي متخصص',
      titleEn: 'Specialized Medical Team',
      imageUrl: '/758.jpeg',
      displayOrder: 2,
      isActive: true
    },
    {
      id: '3',
      title: 'تقنيات طبية متطورة',
      titleEn: 'Advanced Medical Technologies',
      imageUrl: '/984.jfif',
      displayOrder: 3,
      isActive: true
    }
  ]);

  // بيانات تجريبية للأخبار
  const [news, setNews] = useState([
    {
      id: '1',
      title: 'افتتاح وحدة جديدة للعناية المركزة',
      titleEn: 'Opening of New Intensive Care Unit',
      imageUrl: '/WhatsApp Image 2025-07-04 at 12.13.39 AM (1).jpeg',
      category: 'medical',
      publishDate: '2025-01-15',
      isPublished: true
    },
    {
      id: '2',
      title: 'تدشين خدمات الطب النووي في مستشفى الملك خالد',
      titleEn: 'Launch of Nuclear Medicine Services at King Khalid Hospital',
      imageUrl: '/WhatsApp Image 2025-07-04 at 12.13.40 AM (2).jpeg',
      category: 'medical',
      publishDate: '2025-01-12',
      isPublished: true
    },
    {
      id: '3',
      title: 'إطلاق منصة الخدمات الصحية الرقمية الجديدة',
      titleEn: 'Launch of New Digital Health Services Platform',
      imageUrl: '/WhatsApp Image 2025-07-04 at 12.13.40 AM (3).jpeg',
      category: 'technology',
      publishDate: '2025-01-10',
      isPublished: false
    }
  ]);

  // بيانات تجريبية للإنجازات
  const [achievements, setAchievements] = useState([
    {
      id: '1',
      title: 'جائزة التميز في الخدمات الصحية',
      titleEn: 'Excellence Award in Health Services',
      imageUrl: '/achievement1.jpeg',
      year: '2024',
      isActive: true
    },
    {
      id: '2',
      title: 'أفضل منصة صحية رقمية',
      titleEn: 'Best Digital Health Platform',
      imageUrl: '/achievement2.jpeg',
      year: '2024',
      isActive: true
    },
    {
      id: '3',
      title: '4 جوائز في ملتقى نموذج الرعاية الصحية',
      titleEn: '4 awards at the Care Model Forum',
      imageUrl: '/WhatsApp Image 2025-07-04 at 12.13.41 AM.jpeg',
      year: '2025',
      isActive: true
    }
  ]);

  // فئات الأخبار
  const newsCategories = [
    { id: 'medical', name: language === 'ar' ? 'طبي' : 'Medical' },
    { id: 'technology', name: language === 'ar' ? 'تقنية' : 'Technology' },
    { id: 'events', name: language === 'ar' ? 'فعاليات' : 'Events' },
    { id: 'awards', name: language === 'ar' ? 'جوائز' : 'Awards' },
    { id: 'announcements', name: language === 'ar' ? 'إعلانات' : 'Announcements' }
  ];

  // فئات الأسئلة الشائعة
  const faqCategories = [
    { id: 'general', name: language === 'ar' ? 'عام' : 'General' },
    { id: 'appointments', name: language === 'ar' ? 'المواعيد' : 'Appointments' },
    { id: 'services', name: language === 'ar' ? 'الخدمات' : 'Services' },
    { id: 'results', name: language === 'ar' ? 'النتائج' : 'Results' }
  ];

  // التحقق من صلاحيات المستخدم
  const canManageHeroImages = hasPermission('manage_hero_images');
  const canAddHeroImages = hasPermission('add_hero_images');
  const canEditHeroImages = hasPermission('edit_hero_images');
  const canDeleteHeroImages = hasPermission('delete_hero_images');
  
  const canManageNews = hasPermission('manage_news');
  const canAddNews = hasPermission('add_news');
  const canEditNews = hasPermission('edit_news');
  const canDeleteNews = hasPermission('delete_news');
  const canPublishNews = hasPermission('publish_news');
  
  const canManageAchievements = hasPermission('manage_achievements');
  const canAddAchievements = hasPermission('add_achievements');
  const canEditAchievements = hasPermission('edit_achievements');
  const canDeleteAchievements = hasPermission('delete_achievements');

  // بيانات تجريبية للأسئلة الشائعة
  const [faqs, setFaqs] = useState([
    {
      id: '1',
      question: 'كيف يمكنني حجز موعد؟',
      questionEn: 'How can I book an appointment?',
      answer: 'يمكنك حجز موعد من خلال المنصة الرقمية أو الاتصال بالرقم المخصص',
      answerEn: 'You can book an appointment through the digital platform or by calling the dedicated number',
      category: 'appointments',
      isActive: true,
      order: 1,
      autoResponse: true
    },
    {
      id: '2',
      question: 'ما هي ساعات العمل؟',
      questionEn: 'What are the working hours?',
      answer: 'نعمل من الأحد إلى الخميس من 8:00 صباحاً حتى 4:00 مساءً',
      answerEn: 'We work from Sunday to Thursday from 8:00 AM to 4:00 PM',
      category: 'general',
      isActive: true,
      order: 2,
      autoResponse: true
    }
  ]);

  // فلترة التبويبات حسب الصلاحيات
  const availableTabs = tabs.filter(tab => hasPermission(tab.permission));

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAdd = () => {
    setFormData({
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      category: '',
      isActive: true,
      autoResponse: false
    });
    setSelectedFile(null);
    setShowAddModal(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      titleAr: item.title || item.question || '',
      titleEn: item.titleEn || item.questionEn || '',
      descriptionAr: item.description || item.answer || '',
      descriptionEn: item.descriptionEn || item.answerEn || '',
      category: item.category || '',
      isActive: item.isActive,
      autoResponse: item.autoResponse || false
    });
    setShowEditModal(true);
  };

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // التعامل مع صور البطل
  const handleAddHeroImage = () => {
    setFormData({
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      category: '',
      isActive: true,
      autoResponse: false
    });
    setSelectedFile(null);
    setShowAddModal(true);
  };

  const handleEditHeroImage = (item: any) => {
    setSelectedItem(item);
    setFormData({
      titleAr: item.title,
      titleEn: item.titleEn,
      descriptionAr: '',
      descriptionEn: '',
      category: '',
      isActive: item.isActive,
      autoResponse: false
    });
    setShowEditModal(true);
  };

  const handleDeleteHeroImage = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الصورة؟' : 'Are you sure you want to delete this image?')) {
      setHeroImages(heroImages.filter(item => item.id !== id));
      showSuccess(language === 'ar' ? 'تم حذف الصورة بنجاح' : 'Image deleted successfully');
    }
  };

  // التعامل مع الأخبار
  const handleAddNews = () => {
    setFormData({
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      category: 'medical',
      isActive: true,
      autoResponse: false
    });
    setSelectedFile(null);
    setShowAddModal(true);
  };

  const handleEditNews = (item: any) => {
    setSelectedItem(item);
    setFormData({
      titleAr: item.title,
      titleEn: item.titleEn,
      descriptionAr: '',
      descriptionEn: '',
      category: item.category,
      isActive: item.isPublished,
      autoResponse: false
    });
    setShowEditModal(true);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الخبر؟' : 'Are you sure you want to delete this news?')) {
      setNews(news.filter(item => item.id !== id));
      showSuccess(language === 'ar' ? 'تم حذف الخبر بنجاح' : 'News deleted successfully');
    }
  };

  // التعامل مع الإنجازات
  const handleAddAchievement = () => {
    setFormData({
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      category: '',
      isActive: true,
      autoResponse: false
    });
    setSelectedFile(null);
    setShowAddModal(true);
  };

  const handleEditAchievement = (item: any) => {
    setSelectedItem(item);
    setFormData({
      titleAr: item.title,
      titleEn: item.titleEn,
      descriptionAr: '',
      descriptionEn: '',
      category: '',
      isActive: item.isActive,
      autoResponse: false
    });
    setShowEditModal(true);
  };

  const handleDeleteAchievement = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الإنجاز؟' : 'Are you sure you want to delete this achievement?')) {
      setAchievements(achievements.filter(item => item.id !== id));
      showSuccess(language === 'ar' ? 'تم حذف الإنجاز بنجاح' : 'Achievement deleted successfully');
    }
  };

  const handleSave = () => {
    const newItem = {
      id: Date.now().toString(),
      ...formData,
      uploadDate: new Date().toISOString().split('T')[0],
      order: 1
    };

    if (activeTab === 'faqs' || activeTab === 'auto-response') {
      setFaqs([...faqs, {
        ...newItem,
        question: formData.titleAr,
        questionEn: formData.titleEn,
        answer: formData.descriptionAr,
        answerEn: formData.descriptionEn
      }]);
    }

    setShowAddModal(false);
    showSuccess(language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully');
  };

  const handleUpdate = () => {
    if (activeTab === 'faqs' || activeTab === 'auto-response') {
      setFaqs(faqs.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              question: formData.titleAr, 
              questionEn: formData.titleEn,
              answer: formData.descriptionAr,
              answerEn: formData.descriptionEn,
              isActive: formData.isActive,
              autoResponse: formData.autoResponse
            }
          : item
      ));
    }

    setShowEditModal(false);
    showSuccess(language === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully');
  };

  const handleDelete = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
      if (activeTab === 'faqs' || activeTab === 'auto-response') {
        setFaqs(faqs.filter(item => item.id !== id));
      }
      showSuccess(language === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
    }
  };

  const handleToggleStatus = (id: string) => {
    if (activeTab === 'faqs' || activeTab === 'auto-response') {
      setFaqs(faqs.map(item => 
        item.id === id ? { ...item, isActive: !item.isActive } : item
      ));
    }
    showSuccess(language === 'ar' ? 'تم تحديث الحالة' : 'Status updated');
  };

  // التعامل مع الأسئلة الشائعة
  const renderFAQsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'إدارة الأسئلة الشائعة' : 'Manage FAQs'}
        </h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
          {hasPermission('export_pdf') && (
            <button 
              onClick={() => {
                if (hasPermission('export_pdf')) {
                  // تصدير PDF
                  console.log('Exporting PDF...');
                  alert(language === 'ar' ? 'تم تصدير PDF بنجاح' : 'PDF exported successfully');
                }
              }}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'ar' ? 'تصدير PDF' : 'Export PDF'}</span>
            </button>
          )}
          {hasPermission('add_faqs') && (
            <button 
              onClick={handleAdd}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة سؤال' : 'Add FAQ'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'ar' ? faq.question : faq.questionEn}
                </h3>
                <p className="text-gray-600 mb-3">
                  {language === 'ar' ? faq.answer : faq.answerEn}
                </p>
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                    {faq.category}
                  </span>
                  <span>#{faq.order}</span>
                  <span className={`px-2 py-1 rounded-full ${
                    faq.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {faq.isActive ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                  </span>
                  {faq.autoResponse && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                      {language === 'ar' ? 'رد تلقائي' : 'Auto Response'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 rtl:space-x-reverse ml-4">
                {hasPermission('edit_faqs') && (
                  <button 
                    onClick={() => handleEdit(faq)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => handleToggleStatus(faq.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  {faq.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {hasPermission('delete_faqs') && (
                  <button 
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // عرض تبويب صور البطل
  const renderHeroImagesTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'إدارة صور البطل' : 'Manage Hero Images'}
        </h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
          {hasPermission('export_pdf') && (
            <button 
              onClick={() => {
                if (hasPermission('export_pdf')) {
                  // تصدير PDF
                  console.log('Exporting PDF...');
                  alert(language === 'ar' ? 'تم تصدير PDF بنجاح' : 'PDF exported successfully');
                }
              }}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'ar' ? 'تصدير PDF' : 'Export PDF'}</span>
            </button>
          )}
          {canAddHeroImages && (
            <button 
              onClick={handleAddHeroImage}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة صورة' : 'Add Image'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {heroImages.map((image) => (
          <div key={image.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
            <div className="h-48 overflow-hidden">
              <img 
                src={image.imageUrl} 
                alt={language === 'ar' ? image.title : image.titleEn} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'ar' ? image.title : image.titleEn}
              </h3>
              <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  {language === 'ar' ? `الترتيب: ${image.displayOrder}` : `Order: ${image.displayOrder}`}
                </span>
                <span className={`px-2 py-1 rounded-full ${
                  image.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {image.isActive ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                </span>
              </div>
              <div className="flex space-x-2 rtl:space-x-reverse">
                {canEditHeroImages && (
                  <button 
                    onClick={() => handleEditHeroImage(image)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => image.isActive ? null : null}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  {image.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {canDeleteHeroImages && (
                  <button 
                    onClick={() => handleDeleteHeroImage(image.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // عرض تبويب الأخبار
  const renderNewsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'إدارة الأخبار' : 'Manage News'}
        </h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
          {canAddNews && (
            <button 
              onClick={handleAddNews}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة خبر' : 'Add News'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
            <div className="h-48 overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={language === 'ar' ? item.title : item.titleEn} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'ar' ? item.title : item.titleEn}
              </h3>
              <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  {newsCategories.find(cat => cat.id === item.category)?.name || item.category}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {item.publishDate}
                </span>
                <span className={`px-2 py-1 rounded-full ${
                  item.isPublished ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {item.isPublished ? (language === 'ar' ? 'منشور' : 'Published') : (language === 'ar' ? 'مسودة' : 'Draft')}
                </span>
              </div>
              <div className="flex space-x-2 rtl:space-x-reverse">
                {canEditNews && (
                  <button 
                    onClick={() => handleEditNews(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {canPublishNews && !item.isPublished && (
                  <button 
                    onClick={() => null}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                {canDeleteNews && (
                  <button 
                    onClick={() => handleDeleteNews(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // عرض تبويب الإنجازات
  const renderAchievementsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'إدارة الإنجازات' : 'Manage Achievements'}
        </h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
          {canAddAchievements && (
            <button 
              onClick={handleAddAchievement}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة إنجاز' : 'Add Achievement'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
            <div className="h-48 overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={language === 'ar' ? item.title : item.titleEn} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'ar' ? item.title : item.titleEn}
              </h3>
              <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  {item.year}
                </span>
                <span className={`px-2 py-1 rounded-full ${
                  item.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.isActive ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                </span>
              </div>
              <div className="flex space-x-2 rtl:space-x-reverse">
                {canEditAchievements && (
                  <button 
                    onClick={() => handleEditAchievement(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => null}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {canDeleteAchievements && (
                  <button 
                    onClick={() => handleDeleteAchievement(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAutoResponseTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'إدارة الرد التلقائي' : 'Auto Response Management'}
        </h2>
        <button 
          onClick={handleAdd}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{language ===  'ar' ? 'إضافة رد تلقائي' : 'Add Auto Response'}</span>
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          {language === 'ar' ? 'روبوت الرد التلقائي' : 'Auto Response Bot'}
        </h3>
        <p className="text-blue-700 mb-4">
          {language === 'ar' 
            ? 'يقوم الروبوت بالرد التلقائي على الأسئلة الشائعة بناءً على قاعدة البيانات المحددة'
            : 'The bot automatically responds to frequently asked questions based on the defined database'
          }
        </p>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
            {language === 'ar' ? 'نشط' : 'Active'}
          </span>
          <span className="text-sm text-blue-600">
            {language === 'ar' ? 'آخر رد: منذ 5 دقائق' : 'Last response: 5 minutes ago'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.filter(faq => faq.autoResponse).map((faq) => (
          <div key={faq.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'ar' ? faq.question : faq.questionEn}
                </h3>
                <p className="text-gray-600 mb-3">
                  {language === 'ar' ? faq.answer : faq.answerEn}
                </p>
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                    {faq.category}
                  </span>
                  <span>#{faq.order}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">
                    {language === 'ar' ? 'رد تلقائي' : 'Auto Response'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2 rtl:space-x-reverse ml-4">
                <button 
                  onClick={() => handleEdit(faq)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (availableTabs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <HelpCircle className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {language === 'ar' ? 'لا توجد صلاحيات' : 'No Permissions'}
        </h3>
        <p className="text-gray-600">
          {language === 'ar' 
            ? 'ليس لديك صلاحيات لإدارة المحتوى'
            : 'You do not have permissions to manage content'
          }
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'ar' ? 'إدارة المحتوى' : 'Content Management'}
        </h1>
        <p className="text-gray-600">
          {language === 'ar' 
            ? 'إدارة محتوى الموقع والعناصر المرئية'
            : 'Manage website content and visual elements'
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

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 rtl:space-x-reverse">
            {availableTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {activeTab === 'faqs' && renderFAQsTab()}
        {activeTab === 'auto-response' && renderAutoResponseTab()}
        {activeTab === 'hero_images' && renderHeroImagesTab()}
        {activeTab === 'news' && renderNewsTab()}
        {activeTab === 'achievements' && renderAchievementsTab()}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeTab === 'hero_images' && (language === 'ar' ? 'إضافة صورة بطل جديدة' : 'Add New Hero Image')}
              {activeTab === 'news' && (language === 'ar' ? 'إضافة خبر جديد' : 'Add New News')}
              {activeTab === 'achievements' && (language === 'ar' ? 'إضافة إنجاز جديد' : 'Add New Achievement')}
              {activeTab === 'faqs' && (language === 'ar' ? 'إضافة سؤال جديد' : 'Add New FAQ')}
              {activeTab === 'auto-response' && (language === 'ar' ? 'إضافة رد تلقائي جديد' : 'Add New Auto Response')}
            </h2>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان بالعربية' : 'Arabic Title'}
                </label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({...formData, titleAr: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان بالإنجليزية' : 'English Title'}
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({...formData, titleEn: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {(activeTab === 'faqs' || activeTab === 'auto-response') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الوصف بالعربية' : 'Arabic Description'}
                    </label>
                    <textarea
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الوصف بالإنجليزية' : 'English Description'}
                    </label>
                    <textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {(activeTab === 'hero_images' || activeTab === 'news' || activeTab === 'achievements') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الصورة' : 'Image'} *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {selectedFile ? (
                      <div>
                        <div className="flex items-center justify-center mb-4">
                          <Image className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-gray-900 font-medium">{selectedFile.name}</p>
                        <p className="text-gray-500 text-sm">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                          {language === 'ar' ? 'إزالة' : 'Remove'}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-2">
                          {language === 'ar' 
                            ? 'اسحب وأفلت الملف هنا أو انقر للاختيار'
                            : 'Drag and drop file here or click to browse'
                          }
                        </p>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          <span>{language === 'ar' ? 'اختر صورة' : 'Choose Image'}</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'faqs' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'التصنيف' : 'Category'}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{language === 'ar' ? 'اختر التصنيف' : 'Select Category'}</option>
                      <option value="appointments">{language === 'ar' ? 'المواعيد' : 'Appointments'}</option>
                      <option value="general">{language === 'ar' ? 'عام' : 'General'}</option>
                      <option value="results">{language === 'ar' ? 'النتائج' : 'Results'}</option>
                      <option value="services">{language === 'ar' ? 'الخدمات' : 'Services'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.autoResponse}
                        onChange={(e) => setFormData({...formData, autoResponse: e.target.checked})}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {language === 'ar' ? 'تفعيل الرد التلقائي' : 'Enable Auto Response'}
                      </span>
                    </label>
                  </div>
                </>
              )}

              {activeTab === 'news' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الفئة' : 'Category'} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {newsCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'السنة' : 'Year'} *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2025"
                    required
                  />
                </div>
              )}

              <div>
                <label className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </span>
                </label>
              </div>
              
              <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeTab === 'hero_images' && (language === 'ar' ? 'تعديل صورة البطل' : 'Edit Hero Image')}
              {activeTab === 'news' && (language === 'ar' ? 'تعديل الخبر' : 'Edit News')}
              {activeTab === 'achievements' && (language === 'ar' ? 'تعديل الإنجاز' : 'Edit Achievement')}
              {activeTab === 'faqs' && (language === 'ar' ? 'تعديل السؤال' : 'Edit FAQ')}
              {activeTab === 'auto-response' && (language === 'ar' ? 'تعديل الرد التلقائي' : 'Edit Auto Response')}
            </h2>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان بالعربية' : 'Arabic Title'}
                </label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({...formData, titleAr: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان بالإنجليزية' : 'English Title'}
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({...formData, titleEn: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {(activeTab === 'faqs' || activeTab === 'auto-response') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الوصف بالعربية' : 'Arabic Description'}
                    </label>
                    <textarea
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الوصف بالإنجليزية' : 'English Description'}
                    </label>
                    <textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {(activeTab === 'hero_images' || activeTab === 'news' || activeTab === 'achievements') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الصورة الحالية' : 'Current Image'}
                  </label>
                  <div className="border rounded-lg p-2 mb-4">
                    <img 
                      src={selectedItem?.imageUrl} 
                      alt={language === 'ar' ? selectedItem?.title : selectedItem?.titleEn}
                      className="w-full h-40 object-cover rounded"
                    />
                  </div>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'تغيير الصورة (اختياري)' : 'Change Image (Optional)'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {selectedFile ? (
                      <div>
                        <div className="flex items-center justify-center mb-4">
                          <Image className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-gray-900 font-medium">{selectedFile.name}</p>
                        <p className="text-gray-500 text-sm">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                          {language === 'ar' ? 'إزالة' : 'Remove'}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-2">
                          {language === 'ar' 
                            ? 'اسحب وأفلت الملف هنا أو انقر للاختيار'
                            : 'Drag and drop file here or click to browse'
                          }
                        </p>
                        <input
                          type="file"
                          id="file-upload-edit"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <label
                          htmlFor="file-upload-edit"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          <span>{language === 'ar' ? 'اختر صورة' : 'Choose Image'}</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'faqs' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'التصنيف' : 'Category'}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{language === 'ar' ? 'اختر التصنيف' : 'Select Category'}</option>
                      <option value="appointments">{language === 'ar' ? 'المواعيد' : 'Appointments'}</option>
                      <option value="general">{language === 'ar' ? 'عام' : 'General'}</option>
                      <option value="results">{language === 'ar' ? 'النتائج' : 'Results'}</option>
                      <option value="services">{language === 'ar' ? 'الخدمات' : 'Services'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.autoResponse}
                        onChange={(e) => setFormData({...formData, autoResponse: e.target.checked})}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {language === 'ar' ? 'تفعيل الرد التلقائي' : 'Enable Auto Response'}
                      </span>
                    </label>
                  </div>
                </>
              )}

              {activeTab === 'news' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الفئة' : 'Category'} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {newsCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'السنة' : 'Year'} *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2025"
                    required
                  />
                </div>
              )}

              <div>
                <label className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </span>
                </label>
              </div>
              
              <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {language === 'ar' ? 'تحديث' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;