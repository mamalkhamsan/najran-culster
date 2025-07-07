import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, AlertTriangle, CheckCircle, Clock, X, Eye, FileText, Download, MessageSquare, Building, Users, Check, XCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import ConfirmationModal from '../../components/ConfirmationModal'; 
import BackButton from '../../components/BackButton';

const ComplaintsManagement: React.FC = () => {
  const { language } = useLanguage();
  const { user, hasPermission } = useAuth();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);
  const [showResolveModal, setShowResolveModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<{
    type: 'resolve' | 'reject';
    id: string;
    title: string;
    message: string;
  } | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has permission to manage complaints
  const canManageComplaints = hasPermission('manage_complaints');
  const canViewComplaints = hasPermission('view_complaints');

  // Mock data for complaints
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockComplaints = [
        {
          id: 'COMP-2025-1001',
          subject: 'تأخير في موعد الفحص',
          description: 'كان لدي موعد للفحص الطبي في قسم الباطنة ولكن تم تأخيري لأكثر من ساعتين دون إبلاغي بسبب التأخير.',
          department: 'قسم الباطنة',
          departmentEn: 'Internal Medicine',
          departmentId: '2',
          facility: 'مستشفى الملك خالد',
          facilityEn: 'King Khalid Hospital',
          facilityId: '1',
          status: 'pending',
          submittedAt: '2025-01-20T10:30:00',
          isUrgent: false,
          hasAttachment: false,
          patientName: 'محمد سعد القحطاني',
          patientId: '1122334455',
          patientMobile: '0551122334',
          patientEmail: 'mohammed.alqahtani@gmail.com'
        },
        {
          id: 'COMP-2025-1002',
          subject: 'سوء معاملة من موظف الاستقبال',
          description: 'تعرضت لسوء معاملة من موظف الاستقبال عند محاولتي الاستفسار عن موعدي. كان الموظف غير متعاون وغير مهذب في الرد.',
          department: 'قسم الاستقبال',
          departmentEn: 'Reception Department',
          departmentId: '11',
          facility: 'مستشفى الملك خالد',
          facilityEn: 'King Khalid Hospital',
          facilityId: '1',
          status: 'in_progress',
          submittedAt: '2025-01-18T14:15:00',
          resolverName: 'د. ناصر محمد القحطاني',
          isUrgent: true,
          hasAttachment: true,
          attachmentUrl: '/sample-attachment.pdf',
          patientName: 'محمد سعد القحطاني',
          patientId: '1122334455',
          patientMobile: '0551122334',
          patientEmail: 'mohammed.alqahtani@gmail.com'
        },
        {
          id: 'COMP-2025-1003',
          subject: 'خطأ في التشخيص',
          description: 'تم تشخيصي بشكل خاطئ في زيارتي الأخيرة لقسم الطوارئ، مما أدى إلى تأخر العلاج المناسب لحالتي.',
          department: 'قسم الطوارئ',
          departmentEn: 'Emergency Department',
          departmentId: '1',
          facility: 'مستشفى نجران البلد',
          facilityEn: 'Najran City Hospital',
          facilityId: '4',
          status: 'resolved',
          submittedAt: '2025-01-15T09:45:00',
          resolvedAt: '2025-01-17T11:30:00',
          resolverName: 'د. سلطان عبدالله الشمري',
          resolutionNotes: 'تم التواصل مع المريض وتوضيح سبب التشخيص وتقديم الاعتذار. تم تحويل المريض للقسم المختص وتقديم العلاج المناسب.',
          isUrgent: false,
          hasAttachment: false,
          patientName: 'محمد سعد القحطاني',
          patientId: '1122334455',
          patientMobile: '0551122334',
          patientEmail: 'mohammed.alqahtani@gmail.com'
        },
        {
          id: 'COMP-2025-1004',
          subject: 'نقص في الأدوية',
          description: 'ذهبت إلى صيدلية المستشفى لصرف الدواء الموصوف لي، ولكن تم إخباري بعدم توفر الدواء وطلب مني العودة في وقت لاحق.',
          department: 'قسم الصيدلية',
          departmentEn: 'Pharmacy Department',
          departmentId: '12',
          facility: 'مستشفى الملك خالد',
          facilityEn: 'King Khalid Hospital',
          facilityId: '1',
          status: 'rejected',
          submittedAt: '2025-01-10T16:20:00',
          resolvedAt: '2025-01-12T13:15:00',
          resolverName: 'د. ناصر محمد القحطاني',
          resolutionNotes: 'تم التحقق من الشكوى وتبين أن الدواء غير متوفر بسبب نقص عالمي في المادة الفعالة. تم توفير بديل مناسب للمريض.',
          isUrgent: false,
          hasAttachment: true,
          attachmentUrl: '/sample-attachment-2.pdf',
          patientName: 'محمد سعد القحطاني',
          patientId: '1122334455',
          patientMobile: '0551122334',
          patientEmail: 'mohammed.alqahtani@gmail.com'
        }
      ];
      
      setComplaints(mockComplaints);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter complaints based on search, status, facility, and department
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = searchTerm === '' || 
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.patientId.includes(searchTerm);
    
    const matchesStatus = selectedStatus === 'all' || complaint.status === selectedStatus;
    const matchesFacility = selectedFacility === 'all' || complaint.facilityId === selectedFacility;
    const matchesDepartment = selectedDepartment === 'all' || complaint.departmentId === selectedDepartment;
    
    // Filter based on user role and facility
    if (user?.role === 'manager' && user.facility) {
      return matchesSearch && matchesStatus && matchesDepartment && complaint.facility === user.facility;
    }
    
    return matchesSearch && matchesStatus && matchesFacility && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return language === 'ar' ? 'قيد الانتظار' : 'Pending';
      case 'in_progress':
        return language === 'ar' ? 'قيد المعالجة' : 'In Progress';
      case 'resolved':
        return language === 'ar' ? 'تم الحل' : 'Resolved';
      case 'rejected':
        return language === 'ar' ? 'مرفوض' : 'Rejected';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleResolveComplaint = (id: string) => {
    setShowResolveModal(id);
  };

  const handleRejectComplaint = (id: string) => {
    setShowRejectModal(id);
  };

  const confirmResolveComplaint = () => {
    if (!showResolveModal || !resolutionNotes.trim()) return;
    
    const complaint = complaints.find(c => c.id === showResolveModal);
    if (!complaint) return;
    
    // Update complaint status
    setComplaints(complaints.map(c => 
      c.id === showResolveModal 
        ? { 
            ...c, 
            status: 'resolved', 
            resolvedAt: new Date().toISOString(), 
            resolverName: user?.name,
            resolutionNotes
          } 
        : c
    ));
    
    // Add notification for the patient
    addNotification({
      title: language === 'ar' ? 'تم حل الشكوى' : 'Complaint Resolved',
      message: language === 'ar' 
        ? `تم حل شكواك رقم ${complaint.id}. يرجى مراجعة التفاصيل.`
        : `Your complaint ${complaint.id} has been resolved. Please check the details.`,
      type: 'success',
      timestamp: new Date().toISOString(),
      isRead: false,
      relatedId: complaint.id
    });
    
    setShowResolveModal(null);
    setResolutionNotes('');
  };

  const confirmRejectComplaint = () => {
    if (!showRejectModal || !rejectionReason.trim()) return;
    
    const complaint = complaints.find(c => c.id === showRejectModal);
    if (!complaint) return;
    
    // Update complaint status
    setComplaints(complaints.map(c => 
      c.id === showRejectModal 
        ? { 
            ...c, 
            status: 'rejected', 
            resolvedAt: new Date().toISOString(), 
            resolverName: user?.name,
            resolutionNotes: rejectionReason
          } 
        : c
    ));
    
    // Add notification for the patient
    addNotification({
      title: language === 'ar' ? 'تم رفض الشكوى' : 'Complaint Rejected',
      message: language === 'ar' 
        ? `تم رفض شكواك رقم ${complaint.id}. يرجى مراجعة التفاصيل.`
        : `Your complaint ${complaint.id} has been rejected. Please check the details.`,
      type: 'warning',
      timestamp: new Date().toISOString(),
      isRead: false,
      relatedId: complaint.id
    });
    
    setShowRejectModal(null);
    setRejectionReason('');
  };

  const handleStartProcessing = (id: string) => {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;
    
    setConfirmationAction({
      type: 'resolve',
      id,
      title: language === 'ar' ? 'بدء معالجة الشكوى' : 'Start Processing Complaint',
      message: language === 'ar' 
        ? `هل أنت متأكد من بدء معالجة الشكوى رقم ${id}؟`
        : `Are you sure you want to start processing complaint ${id}?`
    });
    setShowConfirmation(true);
  };

  const confirmStartProcessing = (id: string) => {
    // Update complaint status
    setComplaints(complaints.map(c => 
      c.id === id 
        ? { 
            ...c, 
            status: 'in_progress', 
            resolverName: user?.name
          } 
        : c
    ));
    
    const complaint = complaints.find(c => c.id === id);
    if (complaint) {
      // Add notification for the patient
      addNotification({
        title: language === 'ar' ? 'جاري معالجة الشكوى' : 'Complaint In Progress',
        message: language === 'ar' 
          ? `بدأت معالجة شكواك رقم ${complaint.id}.`
          : `Your complaint ${complaint.id} is now being processed.`,
        type: 'info',
        timestamp: new Date().toISOString(),
        isRead: false,
        relatedId: complaint.id
      });
    }
    
    setShowConfirmation(false);
    setConfirmationAction(null);
  };

  const handleConfirmAction = () => {
    if (!confirmationAction) return;
    
    if (confirmationAction.type === 'resolve') {
      confirmStartProcessing(confirmationAction.id);
    }
    
    setShowConfirmation(false);
    setConfirmationAction(null);
  };

  // Check if user has permission to access this page
  if (!canViewComplaints) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'غير مصرح' : 'Unauthorized'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ar' 
              ? 'ليس لديك صلاحية للوصول إلى صفحة إدارة الشكاوى'
              : 'You do not have permission to access the complaints management page'
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <BackButton showHome={true} centered={true} />
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            {language === 'ar' ? 'إدارة الشكاوى' : 'Complaints Management'}
          </h1>
          <p className="text-gray-600 text-center">
            {language === 'ar' 
              ? 'عرض ومعالجة شكاوى المرضى'
              : 'View and process patient complaints'
            }
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'البحث في الشكاوى...' : 'Search complaints...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
              <option value="in_progress">{language === 'ar' ? 'قيد المعالجة' : 'In Progress'}</option>
              <option value="resolved">{language === 'ar' ? 'تم الحل' : 'Resolved'}</option>
              <option value="rejected">{language === 'ar' ? 'مرفوض' : 'Rejected'}</option>
            </select>
            
            {user?.role !== 'manager' && (
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{language === 'ar' ? 'جميع المنشآت' : 'All Facilities'}</option>
                <option value="1">{language === 'ar' ? 'مستشفى الملك خالد' : 'King Khalid Hospital'}</option>
                <option value="4">{language === 'ar' ? 'مستشفى نجران البلد' : 'Najran City Hospital'}</option>
              </select>
            )}
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{language === 'ar' ? 'جميع الأقسام' : 'All Departments'}</option>
              <option value="1">{language === 'ar' ? 'قسم الطوارئ' : 'Emergency Department'}</option>
              <option value="2">{language === 'ar' ? 'قسم الباطنة' : 'Internal Medicine'}</option>
              <option value="11">{language === 'ar' ? 'قسم الاستقبال' : 'Reception Department'}</option>
              <option value="12">{language === 'ar' ? 'قسم الصيدلية' : 'Pharmacy Department'}</option>
            </select>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-6">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <div 
                key={complaint.id} 
                className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 ${
                  complaint.status === 'pending' ? 'border-yellow-500' :
                  complaint.status === 'in_progress' ? 'border-blue-500' :
                  complaint.status === 'resolved' ? 'border-green-500' :
                  'border-red-500'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {complaint.subject}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {getStatusText(complaint.status)}
                      </span>
                      {complaint.isUrgent && (
                        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                          {language === 'ar' ? 'عاجل' : 'Urgent'}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        <span>{formatDate(complaint.submittedAt)} - {formatTime(complaint.submittedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        <span>{language === 'ar' ? complaint.facility : complaint.facilityEn}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        <span>{language === 'ar' ? complaint.department : complaint.departmentEn}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        <span>{complaint.id}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <User className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      <span>{complaint.patientName} - {complaint.patientId}</span>
                    </div>
                    
                    <p className="text-gray-600 line-clamp-2">
                      {complaint.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-2">
                    <button
                      onClick={() => setShowDetailsModal(complaint.id)}
                      className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                    </button>
                    
                    {canManageComplaints && complaint.status === 'pending' && (
                      <button
                        onClick={() => handleStartProcessing(complaint.id)}
                        className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        <span>{language === 'ar' ? 'بدء المعالجة' : 'Start Processing'}</span>
                      </button>
                    )}
                    
                    {canManageComplaints && complaint.status === 'in_progress' && (
                      <>
                        <button
                          onClick={() => handleResolveComplaint(complaint.id)}
                          className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{language === 'ar' ? 'حل الشكوى' : 'Resolve'}</span>
                        </button>
                        
                        <button
                          onClick={() => handleRejectComplaint(complaint.id)}
                          className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>{language === 'ar' ? 'رفض الشكوى' : 'Reject'}</span>
                        </button>
                      </>
                    )}
                    
                    {complaint.hasAttachment && (
                      <button
                        onClick={() => alert(language === 'ar' ? 'جاري تحميل المرفق...' : 'Downloading attachment...')}
                        className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تحميل المرفق' : 'Download'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد شكاوى' : 'No Complaints'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'لا توجد شكاوى تطابق معايير البحث'
                  : 'No complaints match your search criteria'
                }
              </p>
            </div>
          )}
        </div>

        {/* Complaint Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              {(() => {
                const complaint = complaints.find(c => c.id === showDetailsModal);
                if (!complaint) return null;
                
                return (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {language === 'ar' ? 'تفاصيل الشكوى' : 'Complaint Details'}
                      </h2>
                      <button
                        onClick={() => setShowDetailsModal(null)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {complaint.id}
                            </h3>
                            <div className="text-sm text-gray-500">
                              {formatDate(complaint.submittedAt)} - {formatTime(complaint.submittedAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                            {getStatusText(complaint.status)}
                          </span>
                          {complaint.isUrgent && (
                            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                              {language === 'ar' ? 'عاجل' : 'Urgent'}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <h4 className="text-md font-semibold text-blue-800 mb-2 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'معلومات المريض' : 'Patient Information'}
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">{language === 'ar' ? 'الاسم:' : 'Name:'}</span>
                            <span className="ml-2 text-gray-900">{complaint.patientName}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">{language === 'ar' ? 'رقم الهوية:' : 'ID:'}</span>
                            <span className="ml-2 text-gray-900">{complaint.patientId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">{language === 'ar' ? 'رقم الجوال:' : 'Mobile:'}</span>
                            <span className="ml-2 text-gray-900">{complaint.patientMobile}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</span>
                            <span className="ml-2 text-gray-900">{complaint.patientEmail}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'الموضوع' : 'Subject'}
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                            {complaint.subject}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'المنشأة' : 'Facility'}
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                            {language === 'ar' ? complaint.facility : complaint.facilityEn}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'القسم' : 'Department'}
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                            {language === 'ar' ? complaint.department : complaint.departmentEn}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'الحالة' : 'Status'}
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                            {getStatusText(complaint.status)}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'وصف الشكوى' : 'Complaint Description'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-line">
                          {complaint.description}
                        </div>
                      </div>
                      
                      {complaint.hasAttachment && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'المرفقات' : 'Attachments'}
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="text-gray-900">
                                  {complaint.attachmentUrl.split('/').pop()}
                                </span>
                              </div>
                              <button
                                onClick={() => alert(language === 'ar' ? 'جاري تحميل المرفق...' : 'Downloading attachment...')}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                {language === 'ar' ? 'تحميل' : 'Download'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {(complaint.status === 'resolved' || complaint.status === 'rejected') && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ar' ? 'تاريخ الحل' : 'Resolution Date'}
                              </label>
                              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                                {formatDate(complaint.resolvedAt)} - {formatTime(complaint.resolvedAt)}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ar' ? 'تم الحل بواسطة' : 'Resolved By'}
                              </label>
                              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                                {complaint.resolverName}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ar' ? 'ملاحظات الحل' : 'Resolution Notes'}
                            </label>
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-line">
                              {complaint.resolutionNotes}
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                        {canManageComplaints && complaint.status === 'pending' && (
                          <button
                            onClick={() => {
                              setShowDetailsModal(null);
                              handleStartProcessing(complaint.id);
                            }}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            {language === 'ar' ? 'بدء المعالجة' : 'Start Processing'}
                          </button>
                        )}
                        
                        {canManageComplaints && complaint.status === 'in_progress' && (
                          <>
                            <button
                              onClick={() => {
                                setShowDetailsModal(null);
                                handleResolveComplaint(complaint.id);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              {language === 'ar' ? 'حل الشكوى' : 'Resolve'}
                            </button>
                            
                            <button
                              onClick={() => {
                                setShowDetailsModal(null);
                                handleRejectComplaint(complaint.id);
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              {language === 'ar' ? 'رفض الشكوى' : 'Reject'}
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => setShowDetailsModal(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          {language === 'ar' ? 'إغلاق' : 'Close'}
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Resolve Complaint Modal */}
        {showResolveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'حل الشكوى' : 'Resolve Complaint'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'ملاحظات الحل' : 'Resolution Notes'} *
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'ar' ? 'اكتب ملاحظات حول كيفية حل الشكوى...' : 'Write notes about how the complaint was resolved...'}
                    required
                  />
                </div>
                
                <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                  <button
                    onClick={confirmResolveComplaint}
                    disabled={!resolutionNotes.trim()}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {language === 'ar' ? 'حل الشكوى' : 'Resolve Complaint'}
                  </button>
                  <button
                    onClick={() => {
                      setShowResolveModal(null);
                      setResolutionNotes('');
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

        {/* Reject Complaint Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'رفض الشكوى' : 'Reject Complaint'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'سبب الرفض' : 'Rejection Reason'} *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'ar' ? 'اكتب سبب رفض الشكوى...' : 'Write the reason for rejecting the complaint...'}
                    required
                  />
                </div>
                
                <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                  <button
                    onClick={confirmRejectComplaint}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {language === 'ar' ? 'رفض الشكوى' : 'Reject Complaint'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectModal(null);
                      setRejectionReason('');
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
            type="info"
            onConfirm={handleConfirmAction}
            onCancel={() => {
              setShowConfirmation(false);
              setConfirmationAction(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ComplaintsManagement;