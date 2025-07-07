import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Users, Building, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import HideElementButton from '../../components/HideElementButton'; 
import { useAuth } from '../../contexts/AuthContext';

const DepartmentsManagement: React.FC = () => {
  const { language, t } = useLanguage();
  const { hospitals } =  useData();
  const { isElementHidden, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    facilityId: '',
    isActive: true
  });
  const [showHidden, setShowHidden] = useState(false);

  const departments = [
    { id: '1', name: 'قسم الطوارئ', nameEn: 'Emergency Department', facilityId: '1', facilityName: 'مستشفى الملك خالد' },
    { id: '2', name: 'قسم الباطنة', nameEn: 'Internal Medicine', facilityId: '1', facilityName: 'مستشفى الملك خالد' },
    { id: '3', name: 'قسم الجراحة', nameEn: 'Surgery Department', facilityId: '1', facilityName: 'مستشفى الملك خالد' },
    { id: '4', name: 'قسم النساء والولادة', nameEn: 'Obstetrics & Gynecology', facilityId: '4', facilityName: 'مستشفى نجران البلد', isActive: true },
    { id: '5', name: 'قسم الأطفال', nameEn: 'Pediatrics', facilityId: '4', facilityName: 'مستشفى نجران البلد', isActive: false }
  ];

  const filteredDepartments = departments.filter(dept => (
    (showHidden || !isElementHidden('department', dept.id)) &&
    (selectedFacility === '' || dept.facilityId === selectedFacility) &&
    (dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.facilityName.toLowerCase().includes(searchTerm.toLowerCase()))
  ));

  const handleAddDepartment = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      facilityId: '',
      isActive: true
    });
    setShowAddModal(true);
  };

  const handleEditDepartment = (department: any) => {
    setSelectedDepartment(department);
    setFormData({
      nameAr: department.name,
      nameEn: department.nameEn,
      facilityId: department.facilityId,
      isActive: department.isActive || true
    });
    setShowEditModal(true);
  };

  const handleDeleteDepartment = (department: any) => {
    setSelectedDepartment(department);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteDepartment = () => {
    setShowDeleteConfirmation(false);
    setSuccessMessage(language === 'ar' ? 'تم حذف القسم بنجاح' : 'Department deleted successfully');
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleToggleStatus = (id: string) => {
    setDepartments(departments.map(dept => 
      dept.id === id ? { ...dept, isActive: !dept.isActive } : dept
    ));
    
    setSuccessMessage(language === 'ar' 
      ? 'تم تحديث حالة القسم بنجاح' 
      : 'Department status updated successfully');
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleSaveDepartment = () => {
    if (showAddModal) {
      // إضافة قسم جديد
      setShowAddModal(false);
      setSuccessMessage(language === 'ar' ? 'تم إضافة القسم بنجاح' : 'Department added successfully');
    } else {
      // تحديث القسم
      setShowEditModal(false);
      setSuccessMessage(language === 'ar' ? 'تم تحديث القسم بنجاح' : 'Department updated successfully');
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
            {t('manage_departments')}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' 
              ? 'إدارة الأقسام الطبية في المنشآت الصحية'
              : 'Manage medical departments in health facilities'
            }
          </p>
        </div>
        <button
          onClick={handleAddDepartment}
          className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{language === 'ar' ? 'إضافة قسم' : 'Add Department'}</span>
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
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-green-700">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'البحث في الأقسام...' : 'Search departments...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedFacility}
          onChange={(e) => setSelectedFacility(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{language === 'ar' ? 'جميع المنشآت' : 'All Facilities'}</option>
          {hospitals.map(hospital => (
            <option key={hospital.id} value={hospital.id}>
              {language === 'ar' ? hospital.name : hospital.nameEn}
            </option>
          ))}
        </select>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'اسم القسم' : 'Department Name'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'المنشأة' : 'Facility'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDepartments.map((department) => (
                <tr 
                  key={department.id} 
                  className={`hover:bg-gray-50 ${isElementHidden('department', department.id) ? 'bg-red-50/30' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {language === 'ar' ? department.name : department.nameEn}
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === 'ar' ? department.nameEn : department.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      <span>{department.facilityName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium`}>
                      {department.isActive !== false 
                        ? (language === 'ar' ? 'نشط' : 'Active') 
                        : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                      {isElementHidden('department', department.id) && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                          {language === 'ar' ? 'مخفي' : 'Hidden'}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button 
                        onClick={() => handleToggleStatus(department.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={language === 'ar' ? 'تغيير الحالة' : 'Toggle Status'}
                      >
                        {department.isActive !== false ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button 
                        onClick={() => handleEditDepartment(department)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDepartment(department)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={language === 'ar' ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <HideElementButton
                        elementType="department"
                        elementId={department.id}
                        elementName={language === 'ar' ? department.name : department.nameEn}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'إضافة قسم جديد' : 'Add New Department'}
            </h2>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveDepartment(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المنشأة' : 'Facility'} *
                </label>
                <select 
                  value={formData.facilityId}
                  onChange={(e) => setFormData({...formData, facilityId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">{language === 'ar' ? 'اختر المنشأة' : 'Select Facility'}</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.id} value={hospital.id}>
                      {language === 'ar' ? hospital.name : hospital.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'اسم القسم بالعربية' : 'Department Name (Arabic)'} *
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
                  {language === 'ar' ? 'اسم القسم بالإنجليزية' : 'Department Name (English)'} *
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

      {/* Edit Department Modal */}
      {showEditModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'تعديل القسم' : 'Edit Department'}
            </h2>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveDepartment(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المنشأة' : 'Facility'} *
                </label>
                <select 
                  value={formData.facilityId}
                  onChange={(e) => setFormData({...formData, facilityId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">{language === 'ar' ? 'اختر المنشأة' : 'Select Facility'}</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.id} value={hospital.id}>
                      {language === 'ar' ? hospital.name : hospital.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'اسم القسم بالعربية' : 'Department Name (Arabic)'} *
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
                  {language === 'ar' ? 'اسم القسم بالإنجليزية' : 'Department Name (English)'} *
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
      {showDeleteConfirmation && selectedDepartment && (
        <ConfirmationModal
          isOpen={showDeleteConfirmation}
          title={language === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}
          message={
            language === 'ar'
              ? `هل أنت متأكد من حذف ${selectedDepartment.name}؟ هذا الإجراء لا يمكن التراجع عنه.`
              : `Are you sure you want to delete ${selectedDepartment.nameEn}? This action cannot be undone.`
          }
          type="warning"
          onConfirm={confirmDeleteDepartment}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};

export default DepartmentsManagement;