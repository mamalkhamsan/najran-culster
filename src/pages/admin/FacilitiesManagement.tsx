import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Building, MapPin, Eye, EyeOff, AlertTriangle, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import HideElementButton from '../../components/HideElementButton';
import { useAuth } from '../../contexts/AuthContext';

const FacilitiesManagement: React.FC = () => {
  const { language, t } = useLanguage();
  const { hospitals } = useData();
  const { isElementHidden, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [facilityType, setFacilityType] = useState('hospital');
  const [parentHospital, setParentHospital] = useState('');
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    type: 'hospital', 
    parentId: '',
    isActive: true
  });
  const [showHidden, setShowHidden] = useState(false);

  // Get all hospitals, including hidden ones if showHidden is true
  const filteredHospitals = hospitals.filter(hospital => (
    (showHidden || !isElementHidden('facility', hospital.id)) &&
    (hospital.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
     hospital.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ));

  const handleAddFacility = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      type: 'hospital',
      parentId: '',
      isActive: true
    });
    setFacilityType('hospital');
    setParentHospital('');
    setShowAddModal(true);
  };

  const handleEditFacility = (facility: any) => {
    setSelectedFacility(facility);
    setFormData({
      nameAr: facility.name,
      nameEn: facility.nameEn,
      type: facility.type,
      parentId: '',
      isActive: facility.isActive !== false
    });
    setFacilityType(facility.type);
    setShowEditModal(true);
  };

  const handleDeleteFacility = (facility: any) => {
    setSelectedFacility(facility);
    setShowDeleteConfirmation(true);
  };

  const handleToggleStatus = (id: string) => {
    const facility = hospitals.find(f => f.id === id);
    if (!facility) return;
    
    facility.isActive = !facility.isActive;
    
    setSuccessMessage(language === 'ar' 
      ? 'تم تحديث حالة المنشأة بنجاح' 
      : 'Facility status updated successfully');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const confirmDeleteFacility = () => {
    setShowDeleteConfirmation(false);
    setSuccessMessage(language === 'ar' ? 'تم حذف المنشأة بنجاح' : 'Facility deleted successfully');
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleSaveFacility = () => {
    if (showAddModal) {
      // إضافة منشأة جديدة
      setShowAddModal(false);
      setSuccessMessage(language === 'ar' ? 'تم إضافة المنشأة بنجاح' : 'Facility added successfully');
    } else {
      // تحديث المنشأة
      setShowEditModal(false);
      setSuccessMessage(language === 'ar' ? 'تم تحديث المنشأة بنجاح' : 'Facility updated successfully');
    }
    
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('manage_facilities')}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' 
              ? 'إدارة المستشفيات والمراكز الصحية'
              : 'Manage hospitals and health centers'
            }
          </p>
        </div>
        <button
          onClick={handleAddFacility}
          className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{language === 'ar' ? 'إضافة منشأة' : 'Add Facility'}</span>
        </button>
      </div>

      {/* Show Hidden Elements Toggle */}
      {hasPermission('hide_elements') && (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-700 font-medium">
              {language === 'ar' ? 'العناصر المخفية لا تظهر للمستخدمين الآخرين' : 'Hidden elements are not visible to other users'}
            </span>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={() => setShowHidden(!showHidden)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-blue-700">
              {language === 'ar' ? 'إظهار العناصر المخفية' : 'Show Hidden Elements'}
            </span>
          </label>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Building className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-green-700">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'البحث في المنشآت...' : 'Search facilities...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital) => (
          <div 
            key={hospital.id} 
            className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
              isElementHidden('facility', hospital.id) ? 'opacity-60 border border-red-300' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <Building className="w-6 h-6 text-blue-600" />
              </div> 
              <div className="flex space-x-2 rtl:space-x-reverse">
                {isElementHidden('facility', hospital.id) && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                    {language === 'ar' ? 'مخفي' : 'Hidden'}
                  </span>
                )}
                <HideElementButton
                  elementType="facility"
                  elementId={hospital.id}
                  elementName={language === 'ar' ? hospital.name : hospital.nameEn}
                />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'ar' ? hospital.name : hospital.nameEn}
            </h3>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              <span className="text-sm">نجران، المملكة العربية السعودية</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {hospital.centers.length} {language === 'ar' ? 'مركز صحي' : 'Health Centers'}
              </span>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  hospital.type === 'hospital' 
                    ? 'bg-blue-100 text-blue-600' 
                    : hospital.type === 'specialized_center'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-green-100 text-green-600'
                }`}>
                  {hospital.type === 'hospital' 
                    ? (language === 'ar' ? 'مستشفى' : 'Hospital')
                    : hospital.type === 'specialized_center'
                      ? (language === 'ar' ? 'مركز متخصص' : 'Specialized Center')
                      : (language === 'ar' ? 'مركز صحي' : 'Health Center')
                  }
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  hospital.isActive !== false 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {hospital.isActive !== false 
                    ? (language === 'ar' ? 'نشط' : 'Active')
                    : (language === 'ar' ? 'غير نشط' : 'Inactive')
                  }
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => handleToggleStatus(hospital.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title={language === 'ar' ? 'تغيير الحالة' : 'Toggle Status'}
              >
                {hospital.isActive !== false ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleEditFacility(hospital)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title={language === 'ar' ? 'تعديل' : 'Edit'}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteFacility(hospital)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title={language === 'ar' ? 'حذف' : 'Delete'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <HideElementButton
                elementType="facility"
                elementId={hospital.id}
                elementName={language === 'ar' ? hospital.name : hospital.nameEn}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Facility Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'إضافة منشأة جديدة' : 'Add New Facility'}
            </h2>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveFacility(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'} *
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'} *
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نوع المنشأة' : 'Facility Type'} *
                </label>
                <select 
                  value={facilityType}
                  onChange={(e) => {
                    setFacilityType(e.target.value);
                    setFormData({...formData, type: e.target.value});
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="hospital">{language === 'ar' ? 'مستشفى' : 'Hospital'}</option>
                  <option value="specialized_center">{language === 'ar' ? 'مركز متخصص' : 'Specialized Center'}</option>
                  <option value="health_center">{language === 'ar' ? 'مركز صحي' : 'Health Center'}</option>
                </select>
              </div>
              
              {facilityType === 'health_center' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'المستشفى الأم' : 'Parent Hospital'} *
                  </label>
                  <select 
                    value={parentHospital}
                    onChange={(e) => {
                      setParentHospital(e.target.value);
                      setFormData({...formData, parentId: e.target.value});
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{language === 'ar' ? 'اختر المستشفى' : 'Select Hospital'}</option>
                    {hospitals.filter(h => h.type === 'hospital').map(hospital => (
                      <option key={hospital.id} value={hospital.id}>
                        {language === 'ar' ? hospital.name : hospital.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </label>
                </div>
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

      {/* Edit Facility Modal */}
      {showEditModal && selectedFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'تعديل المنشأة' : 'Edit Facility'}
            </h2>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveFacility(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'} *
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'} *
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نوع المنشأة' : 'Facility Type'} *
                </label>
                <select 
                  value={facilityType}
                  onChange={(e) => {
                    setFacilityType(e.target.value);
                    setFormData({...formData, type: e.target.value});
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="hospital">{language === 'ar' ? 'مستشفى' : 'Hospital'}</option>
                  <option value="specialized_center">{language === 'ar' ? 'مركز متخصص' : 'Specialized Center'}</option>
                  <option value="health_center">{language === 'ar' ? 'مركز صحي' : 'Health Center'}</option>
                </select>
              </div>
              
              {facilityType === 'health_center' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'المستشفى الأم' : 'Parent Hospital'} *
                  </label>
                  <select 
                    value={parentHospital}
                    onChange={(e) => {
                      setParentHospital(e.target.value);
                      setFormData({...formData, parentId: e.target.value});
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{language === 'ar' ? 'اختر المستشفى' : 'Select Hospital'}</option>
                    {hospitals.filter(h => h.type === 'hospital').map(hospital => (
                      <option key={hospital.id} value={hospital.id}>
                        {language === 'ar' ? hospital.name : hospital.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </label>
                </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && selectedFacility && (
        <ConfirmationModal
          isOpen={showDeleteConfirmation}
          title={language === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}
          message={
            language === 'ar'
              ? `هل أنت متأكد من حذف ${selectedFacility.name}؟ هذا الإجراء لا يمكن التراجع عنه.`
              : `Are you sure you want to delete ${selectedFacility.nameEn}? This action cannot be undone.`
          }
          type="warning"
          onConfirm={confirmDeleteFacility}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};

export default FacilitiesManagement;