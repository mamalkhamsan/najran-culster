import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, User, Building, Users, Eye, EyeOff, Filter, AlertTriangle, Check, X, Upload } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import HideElementButton from '../../components/HideElementButton';
import { useAuth } from '../../contexts/AuthContext';

const DoctorsManagement: React.FC = () => {
  const { language, t } = useLanguage();
  const { hospitals } = useData();
  const { isElementHidden, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedContractType, setSelectedContractType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    nationalId: '',
    email: '',
    mobile: '',
    specialty: '',
    specialtyEn: '',
    facilityId: '',
    departmentId: '',
    contractType: 'temporary',
    isActive: true
  });
  const [showHidden, setShowHidden] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Empty doctors array
  const doctors: any[] = [];

  // Departments data
  const departments = [
    { id: 'all', name: language === 'ar' ? 'جميع الأقسام' : 'All Departments' },
    { id: 'قسم الطوارئ', name: 'قسم الطوارئ', nameEn: 'Emergency Department' },
    { id: 'قسم الباطنة', name: 'قسم الباطنة', nameEn: 'Internal Medicine Department' },
    { id: 'قسم الجراحة', name: 'قسم الجراحة', nameEn: 'Surgery Department' },
    { id: 'قسم النساء والولادة', name: 'قسم النساء والولادة', nameEn: 'Obstetrics & Gynecology Department' },
    { id: 'قسم الأطفال', name: 'قسم الأطفال', nameEn: 'Pediatrics Department' },
    { id: 'قسم العيون', name: 'قسم العيون', nameEn: 'Ophthalmology Department' },
    { id: 'قسم الأنف والأذن والحنجرة', name: 'قسم الأنف والأذن والحنجرة', nameEn: 'ENT Department' }
  ];

  // Filter doctors based on search and filters
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm === '' || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialtyEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.nationalId.includes(searchTerm) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFacility = selectedFacility === 'all' || doctor.facility === selectedFacility;
    const matchesDepartment = selectedDepartment === 'all' || doctor.department === selectedDepartment;
    const matchesContractType = selectedContractType === 'all' || doctor.contractType === selectedContractType;
    
    return matchesSearch && matchesFacility && matchesDepartment && matchesContractType && (showHidden || !isElementHidden('doctor', doctor.id));
  });

  const handleAddDoctor = () => {
    setFormData({
      name: '',
      nameEn: '',
      nationalId: '',
      email: '',
      mobile: '',
      specialty: '',
      specialtyEn: '',
      facilityId: '',
      departmentId: '',
      contractType: 'temporary',
      isActive: true
    });
    setImagePreview(null);
    setUploadedImage(null);
    setShowAddModal(true);
  };

  const handleEditDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      nameEn: doctor.nameEn,
      nationalId: doctor.nationalId,
      email: doctor.email,
      mobile: doctor.mobile,
      specialty: doctor.specialty,
      specialtyEn: doctor.specialtyEn,
      facilityId: doctor.facility,
      departmentId: doctor.department,
      contractType: doctor.contractType,
      isActive: doctor.isActive
    });
    setImagePreview(doctor.imageUrl);
    setShowEditModal(true);
  };

  const handleDeleteDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    setSuccessMessage(language === 'ar' ? 'تم حذف الطبيب بنجاح' : 'Doctor deleted successfully');
    setShowSuccessMessage(true);
    setShowConfirmation(false);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDoctor = () => {
    // Validate form
    if (!formData.name || !formData.nameEn || !formData.nationalId || !formData.mobile || !formData.specialty || !formData.specialtyEn || !formData.facilityId || !formData.departmentId) {
      alert(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    
    // Save doctor logic
    const message = showEditModal 
      ? (language === 'ar' ? 'تم تحديث بيانات الطبيب بنجاح' : 'Doctor information updated successfully')
      : (language === 'ar' ? 'تم إضافة الطبيب بنجاح' : 'Doctor added successfully');
    
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setShowAddModal(false);
    setShowEditModal(false);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Check if user has permission to manage doctors
  if (!hasPermission('manage_doctors')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'غير مصرح' : 'Unauthorized'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ar' 
              ? 'ليس لديك صلاحية للوصول إلى إدارة الأطباء'
              : 'You do not have permission to access doctors management'
            }
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'ar' ? 'العودة' : 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إدارة الأطباء' : 'Doctors Management'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' 
              ? 'إدارة بيانات الأطباء وعقودهم'
              : 'Manage doctors information and contracts'
            }
          </p>
        </div>
        <button
          onClick={handleAddDoctor}
          className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{language === 'ar' ? 'إضافة طبيب' : 'Add Doctor'}</span>
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
              {language === 'ar' ? 'إظهار الأطباء المخفيين' : 'Show Hidden Doctors'}
            </span>
          </label>
        </div>
      )}

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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'البحث في الأطباء...' : 'Search doctors...'}
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
            <option value="all">{language === 'ar' ? 'جميع المنشآت' : 'All Facilities'}</option>
            {hospitals.map(hospital => (
              <option key={hospital.id} value={hospital.name}>
                {language === 'ar' ? hospital.name : hospital.nameEn}
              </option>
            ))}
          </select>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{language === 'ar' ? 'جميع الأقسام' : 'All Departments'}</option>
            {departments.filter(dept => dept.id !== 'all').map(dept => (
              <option key={dept.id} value={dept.id}>
                {language === 'ar' ? dept.name : dept.nameEn}
              </option>
            ))}
          </select>
          
          <select
            value={selectedContractType}
            onChange={(e) => setSelectedContractType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{language === 'ar' ? 'جميع أنواع العقود' : 'All Contract Types'}</option>
            <option value="permanent">{language === 'ar' ? 'تعاقد دائم' : 'Permanent Contract'}</option>
            <option value="temporary">{language === 'ar' ? 'تعاقد مؤقت' : 'Temporary Contract'}</option>
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Doctor cards have been removed */}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {language === 'ar' ? 'لا يوجد أطباء' : 'No Doctors Found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === 'ar' 
              ? 'لا يوجد أطباء مطابقين لمعايير البحث'
              : 'No doctors match your search criteria'
            }
          </p>
          <button
            onClick={handleAddDoctor}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>{language === 'ar' ? 'إضافة طبيب جديد' : 'Add New Doctor'}</span>
          </button>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'إضافة طبيب جديد' : 'Add New Doctor'}
            </h2>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الاسم (بالعربية)' : 'Name (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الاسم (بالإنجليزية)' : 'Name (English)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم الهوية' : 'National ID'} *
                  </label>
                  <input
                    type="text"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم الجوال' : 'Mobile Number'} *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'التخصص (بالعربية)' : 'Specialty (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'التخصص (بالإنجليزية)' : 'Specialty (English)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.specialtyEn}
                    onChange={(e) => setFormData({...formData, specialtyEn: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <option key={hospital.id} value={hospital.name}>
                        {language === 'ar' ? hospital.name : hospital.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'القسم' : 'Department'} *
                  </label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{language === 'ar' ? 'اختر القسم' : 'Select Department'}</option>
                    {departments.filter(dept => dept.id !== 'all').map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {language === 'ar' ? dept.name : dept.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نوع التعاقد' : 'Contract Type'} *
                </label>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contractType"
                      value="permanent"
                      checked={formData.contractType === 'permanent'}
                      onChange={() => setFormData({...formData, contractType: 'permanent'})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {language === 'ar' ? 'تعاقد دائم' : 'Permanent Contract'}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contractType"
                      value="temporary"
                      checked={formData.contractType === 'temporary'}
                      onChange={() => setFormData({...formData, contractType: 'temporary'})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {language === 'ar' ? 'تعاقد مؤقت' : 'Temporary Contract'}
                    </span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'صورة الطبيب' : 'Doctor Image'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div>
                      <img 
                        src={imagePreview} 
                        alt="Doctor Preview" 
                        className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-blue-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImage(null);
                          setImagePreview(null);
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
                        onChange={handleImageChange}
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
              
              <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={handleSaveDoctor}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'تعديل بيانات الطبيب' : 'Edit Doctor Information'}
            </h2>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الاسم (بالعربية)' : 'Name (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الاسم (بالإنجليزية)' : 'Name (English)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم الهوية' : 'National ID'} *
                  </label>
                  <input
                    type="text"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم الجوال' : 'Mobile Number'} *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'التخصص (بالعربية)' : 'Specialty (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'التخصص (بالإنجليزية)' : 'Specialty (English)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.specialtyEn}
                    onChange={(e) => setFormData({...formData, specialtyEn: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <option key={hospital.id} value={hospital.name}>
                        {language === 'ar' ? hospital.name : hospital.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'القسم' : 'Department'} *
                  </label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{language === 'ar' ? 'اختر القسم' : 'Select Department'}</option>
                    {departments.filter(dept => dept.id !== 'all').map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {language === 'ar' ? dept.name : dept.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نوع التعاقد' : 'Contract Type'} *
                </label>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contractType"
                      value="permanent"
                      checked={formData.contractType === 'permanent'}
                      onChange={() => setFormData({...formData, contractType: 'permanent'})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {language === 'ar' ? 'تعاقد دائم' : 'Permanent Contract'}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contractType"
                      value="temporary"
                      checked={formData.contractType === 'temporary'}
                      onChange={() => setFormData({...formData, contractType: 'temporary'})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {language === 'ar' ? 'تعاقد مؤقت' : 'Temporary Contract'}
                    </span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'صورة الطبيب' : 'Doctor Image'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div>
                      <img 
                        src={imagePreview} 
                        alt="Doctor Preview" 
                        className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-blue-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImage(null);
                          setImagePreview(null);
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
                        id="file-upload-edit"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="file-upload-edit"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>{language === 'ar' ? 'اختر صورة' : 'Browse Image'}</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={handleSaveDoctor}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {language === 'ar' ? 'تحديث' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDoctor(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && selectedDoctor && (
        <ConfirmationModal
          isOpen={showConfirmation}
          title={language === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}
          message={language === 'ar' 
            ? `هل أنت متأكد من حذف الطبيب ${selectedDoctor.name}؟ هذا الإجراء لا يمكن التراجع عنه.`
            : `Are you sure you want to delete Dr. ${selectedDoctor.nameEn}? This action cannot be undone.`
          }
          type="warning"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirmation(false);
            setSelectedDoctor(null);
          }}
        />
      )}
    </div>
  );
};

export default DoctorsManagement;