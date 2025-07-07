import React, { useState, useEffect } from 'react';
import { Home, Image, Plus, Edit, Trash2, Upload, Save, Check, X, Eye, EyeOff, Book, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmationModal from '../../components/ConfirmationModal';

const HomepageSettings: React.FC = () => {
  const { language } = useLanguage();
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('hero');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<{
    type: 'delete' | 'save';
    id?: string;
    title: string;
    message: string;
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Hero Images data
  const [heroImages, setHeroImages] = useState([
    { id: '1', title: 'صورة البطل الرئيسية', imageUrl: '/3bdb653c-3f39-43eb-943f-22da6e80b8f7.jfif', order: 1, isActive: true },
    { id: '2', title: 'صورة البطل الثانية', imageUrl: '', order: 2, isActive: true },
    { id: '3', title: 'صورة البطل الثالثة', imageUrl: '', order: 3, isActive: true },
    { id: '4', title: 'صورة البطل الرابعة', imageUrl: '', order: 4, isActive: false }
  ]);

  // Publications data
  const [publications, setPublications] = useState([
    { id: '1', title: 'منشور تجمع نجران الصحي', imageUrl: '/4a20a1bf-4fee-433c-8f65-93ceab5a9ca7.jfif', order: 1, isActive: true },
    { id: '2', title: 'الملف الإعلامي', imageUrl: 'public/1512144.jpg', order: 2, isActive: true },
    { id: '3', title: 'منشور الصحة العامة', imageUrl: '/758 copy.jpeg', order: 3, isActive: true },
    { id: '4', title: 'منشور التوعية الصحية', imageUrl: '/984 copy.jfif', order: 4, isActive: true },
    { id: '5', title: 'منشور الخدمات الصحية', imageUrl: '/9933.jfif', order: 5, isActive: true }
  ]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new item
  const handleAddItem = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowAddModal(true);
  };

  // Edit item
  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setPreviewUrl(item.imageUrl);
    setShowEditModal(true);
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    const itemToDelete = activeTab === 'hero' 
      ? heroImages.find(item => item.id === id)
      : publications.find(item => item.id === id);
    
    if (!itemToDelete) return;
    
    setSelectedItem(itemToDelete);
    setConfirmationAction({
      type: 'delete',
      id,
      title: language === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion',
      message: language === 'ar' 
        ? `هل أنت متأكد من حذف "${itemToDelete.title}"؟`
        : `Are you sure you want to delete "${itemToDelete.title}"?`
    });
    setShowConfirmation(true);
  };

  // Save new item
  const handleSave = () => {
    if (!selectedFile && !previewUrl) {
      alert(language === 'ar' ? 'الرجاء اختيار صورة' : 'Please select an image');
      return;
    }
    
    const title = document.getElementById('title') as HTMLInputElement;
    if (!title.value) {
      alert(language === 'ar' ? 'الرجاء إدخال العنوان' : 'Please enter a title');
      return;
    }
    
    setConfirmationAction({
      type: 'save',
      title: language === 'ar' ? 'تأكيد الحفظ' : 'Confirm Save',
      message: language === 'ar' ? 'هل أنت متأكد من حفظ هذا العنصر؟' : 'Are you sure you want to save this item?'
    });
    setShowConfirmation(true);
  };

  // Confirm action
  const confirmAction = () => {
    if (!confirmationAction) return;
    
    if (confirmationAction.type === 'delete' && confirmationAction.id) {
      if (activeTab === 'hero') {
        setHeroImages(heroImages.filter(item => item.id !== confirmationAction.id));
      } else if (activeTab === 'publications') {
        setPublications(publications.filter(item => item.id !== confirmationAction.id));
      }
      
      setSuccessMessage(language === 'ar' ? 'تم حذف العنصر بنجاح' : 'Item deleted successfully');
    } else if (confirmationAction.type === 'save') {
      const title = document.getElementById('title') as HTMLInputElement;
      const order = document.getElementById('order') as HTMLInputElement;
      const isActive = document.getElementById('isActive') as HTMLInputElement;
      
      const newItem = {
        id: showEditModal && selectedItem ? selectedItem.id : Date.now().toString(),
        title: title.value,
        imageUrl: previewUrl || '/placeholder.jpg',
        order: parseInt(order.value) || 1,
        isActive: isActive.checked
      };
      
      if (showAddModal) {
        if (activeTab === 'hero') {
          setHeroImages([...heroImages, newItem]);
        } else if (activeTab === 'publications') {
          setPublications([...publications, newItem]);
        }
        setSuccessMessage(language === 'ar' ? 'تمت إضافة العنصر بنجاح' : 'Item added successfully');
      } else if (showEditModal && selectedItem) {
        if (activeTab === 'hero') {
          setHeroImages(heroImages.map(item => item.id === selectedItem.id ? newItem : item));
        } else if (activeTab === 'publications') {
          setPublications(publications.map(item => item.id === selectedItem.id ? newItem : item));
        }
        setSuccessMessage(language === 'ar' ? 'تم تحديث العنصر بنجاح' : 'Item updated successfully');
      }
    }
    
    setShowConfirmation(false);
    setConfirmationAction(null);
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedItem(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Toggle item status
  const toggleItemStatus = (id: string) => {
    if (activeTab === 'hero') {
      setHeroImages(heroImages.map(item => 
        item.id === id ? { ...item, isActive: !item.isActive } : item
      ));
    } else if (activeTab === 'publications') {
      setPublications(publications.map(item => 
        item.id === id ? { ...item, isActive: !item.isActive } : item
      ));
    }
    
    setSuccessMessage(language === 'ar' ? 'تم تحديث حالة العنصر بنجاح' : 'Item status updated successfully');
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Check permissions
  const canManageHeroImages = hasPermission('manage_hero_images');
  const canAddHeroImages = hasPermission('add_hero_images');
  const canEditHeroImages = hasPermission('edit_hero_images');
  const canDeleteHeroImages = hasPermission('delete_hero_images');
  
  const canManagePublications = hasPermission('manage_hero_images'); // Using same permission for now

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'ar' ? 'إعدادات الصفحة الرئيسية' : 'Homepage Settings'}
        </h1>
        <p className="text-gray-600">
          {language === 'ar' 
            ? 'إدارة محتوى وإعدادات الصفحة الرئيسية'
            : 'Manage homepage content and settings'
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
      <div className="bg-white rounded-xl shadow-lg mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 rtl:space-x-reverse px-6">
            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center space-x-2 rtl:space-x-reverse py-4 border-b-2 font-medium text-sm ${
                activeTab === 'hero'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Image className="w-5 h-5" />
              <span>{language === 'ar' ? 'صور البطل' : 'Hero Images'}</span>
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`flex items-center space-x-2 rtl:space-x-reverse py-4 border-b-2 font-medium text-sm ${
                activeTab === 'publications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Book className="w-5 h-5" />
              <span>{language === 'ar' ? 'منشوراتنا' : 'Our Publications'}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Hero Images Tab */}
        {activeTab === 'hero' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إدارة صور البطل' : 'Manage Hero Images'}
              </h2>
              {canAddHeroImages && (
                <button
                  onClick={handleAddItem}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إضافة صورة' : 'Add Image'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroImages.map((image) => (
                <div key={image.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={image.imageUrl} 
                      alt={image.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">{image.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        image.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {image.isActive ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {language === 'ar' ? `الترتيب: ${image.order}` : `Order: ${image.order}`}
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      {canEditHeroImages && (
                        <button
                          onClick={() => toggleItemStatus(image.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={image.isActive ? (language === 'ar' ? 'إلغاء التنشيط' : 'Deactivate') : (language === 'ar' ? 'تنشيط' : 'Activate')}
                        >
                          {image.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                      {canEditHeroImages && (
                        <button
                          onClick={() => handleEditItem(image)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={language === 'ar' ? 'تعديل' : 'Edit'}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDeleteHeroImages && (
                        <button
                          onClick={() => handleDeleteItem(image.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={language === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {heroImages.length === 0 && (
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {language === 'ar' ? 'لا توجد صور' : 'No Images'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'ar' 
                    ? 'لم يتم إضافة أي صور بعد'
                    : 'No images have been added yet'
                  }
                </p>
                {canAddHeroImages && (
                  <button
                    onClick={handleAddItem}
                    className="inline-flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'ar' ? 'إضافة صورة' : 'Add Image'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Publications Tab */}
        {activeTab === 'publications' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إدارة المنشورات' : 'Manage Publications'}
              </h2>
              {canManagePublications && (
                <button
                  onClick={handleAddItem}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إضافة منشور' : 'Add Publication'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((publication) => (
                <div key={publication.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={publication.imageUrl} 
                      alt={publication.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">{publication.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        publication.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {publication.isActive ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {language === 'ar' ? `الترتيب: ${publication.order}` : `Order: ${publication.order}`}
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      {canManagePublications && (
                        <button
                          onClick={() => toggleItemStatus(publication.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={publication.isActive ? (language === 'ar' ? 'إلغاء التنشيط' : 'Deactivate') : (language === 'ar' ? 'تنشيط' : 'Activate')}
                        >
                          {publication.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                      {canManagePublications && (
                        <button
                          onClick={() => handleEditItem(publication)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={language === 'ar' ? 'تعديل' : 'Edit'}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canManagePublications && (
                        <button
                          onClick={() => handleDeleteItem(publication.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={language === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {publications.length === 0 && (
              <div className="text-center py-12">
                <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {language === 'ar' ? 'لا توجد منشورات' : 'No Publications'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'ar' 
                    ? 'لم يتم إضافة أي منشورات بعد'
                    : 'No publications have been added yet'
                  }
                </p>
                {canManagePublications && (
                  <button
                    onClick={handleAddItem}
                    className="inline-flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'ar' ? 'إضافة منشور' : 'Add Publication'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeTab === 'hero' 
                ? (language === 'ar' ? 'إضافة صورة بطل جديدة' : 'Add New Hero Image')
                : (language === 'ar' ? 'إضافة منشور جديد' : 'Add New Publication')
              }
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان' : 'Title'} *
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الترتيب' : 'Order'} *
                </label>
                <input
                  type="number"
                  id="order"
                  defaultValue="1"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الصورة' : 'Image'} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {previewUrl ? (
                    <div>
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-48 mx-auto mb-4 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
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
                          ? 'اسحب وأفلت الصورة هنا أو انقر للاختيار'
                          : 'Drag and drop image here or click to browse'
                        }
                      </p>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>{language === 'ar' ? 'اختر صورة' : 'Browse Image'}</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </span>
                </label>
              </div>
              
              <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeTab === 'hero' 
                ? (language === 'ar' ? 'تعديل صورة البطل' : 'Edit Hero Image')
                : (language === 'ar' ? 'تعديل المنشور' : 'Edit Publication')
              }
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان' : 'Title'} *
                </label>
                <input
                  type="text"
                  id="title"
                  defaultValue={selectedItem.title}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الترتيب' : 'Order'} *
                </label>
                <input
                  type="number"
                  id="order"
                  defaultValue={selectedItem.order}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الصورة' : 'Image'} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {previewUrl ? (
                    <div>
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-48 mx-auto mb-4 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        {language === 'ar' ? 'تغيير الصورة' : 'Change Image'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-2">
                        {language === 'ar' 
                          ? 'اسحب وأفلت الصورة هنا أو انقر للاختيار'
                          : 'Drag and drop image here or click to browse'
                        }
                      </p>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>{language === 'ar' ? 'اختر صورة' : 'Browse Image'}</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    defaultChecked={selectedItem.isActive}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </span>
                </label>
              </div>
              
              <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {language === 'ar' ? 'تحديث' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && confirmationAction && (
        <ConfirmationModal
          isOpen={showConfirmation}
          title={confirmationAction.title}
          message={confirmationAction.message}
          type={confirmationAction.type === 'delete' ? 'warning' : 'info'}
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

export default HomepageSettings;