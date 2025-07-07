import React, { useState, useEffect } from 'react';
import { Users, Search, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface ServiceRequest {
  id: string;
  serviceName: string;
  requesterName: string;
  requesterEmail: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  description: string;
  assignedTo?: string;
}

const ApproveServices: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockRequests: ServiceRequest[] = [
      {
        id: 'REQ-001',
        serviceName: 'Medical Consultation',
        requesterName: 'أحمد محمد',
        requesterEmail: 'ahmed@example.com',
        department: 'Internal Medicine',
        priority: 'high',
        status: 'pending',
        submittedAt: '2024-01-15T10:30:00Z',
        description: 'Urgent consultation needed for patient with chest pain',
        assignedTo: 'Dr. Sarah Johnson'
      },
      {
        id: 'REQ-002',
        serviceName: 'Lab Test Request',
        requesterName: 'فاطمة علي',
        requesterEmail: 'fatima@example.com',
        department: 'Laboratory',
        priority: 'medium',
        status: 'pending',
        submittedAt: '2024-01-15T09:15:00Z',
        description: 'Blood work and CBC required'
      },
      {
        id: 'REQ-003',
        serviceName: 'Radiology Scan',
        requesterName: 'محمد خالد',
        requesterEmail: 'mohammed@example.com',
        department: 'Radiology',
        priority: 'low',
        status: 'approved',
        submittedAt: '2024-01-14T14:20:00Z',
        description: 'X-ray examination for fracture assessment'
      }
    ];

    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.assignedTo && request.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      )
    );
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton showHome={true} />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <BackButton showHome={true} />
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              الموافقة على الخدمات
            </h1>
            <p className="text-gray-600 text-lg">
              مراجعة والموافقة على طلبات الخدمات المقدمة
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="approved">موافق عليها</option>
                <option value="rejected">مرفوضة</option>
              </select>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
              <div className="text-blue-600 text-sm">إجمالي الطلبات</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-yellow-600 text-sm">قيد الانتظار</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-green-600 text-sm">موافق عليها</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-red-600">
                {requests.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-red-600 text-sm">مرفوضة</div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                لا توجد طلبات
              </h3>
              <p className="text-gray-500">
                لم يتم العثور على طلبات تطابق معايير البحث
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {request.serviceName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority === 'high' ? 'عالية' : 
                         request.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status === 'pending' ? 'قيد الانتظار' :
                         request.status === 'approved' ? 'موافق عليها' : 'مرفوضة'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>رقم الطلب:</strong> {request.id}
                      </div>
                      <div>
                        <strong>مقدم الطلب:</strong> {request.requesterName}
                      </div>
                      <div>
                        <strong>القسم:</strong> {request.department}
                      </div>
                      <div>
                        <strong>تاريخ التقديم:</strong> {new Date(request.submittedAt).toLocaleDateString('ar-SA')}
                      </div>
                      {request.assignedTo && (
                        <div className="md:col-span-2">
                          <strong>مُعيَّن إلى:</strong> {request.assignedTo}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <strong className="text-sm text-gray-600">الوصف:</strong>
                      <p className="text-gray-700 mt-1">{request.description}</p>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        موافقة
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                        رفض
                      </button>
                    </div>
                  )}

                  {request.status !== 'pending' && (
                    <div className="flex items-center gap-2 text-sm">
                      {request.status === 'approved' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={request.status === 'approved' ? 'text-green-600' : 'text-red-600'}>
                        {request.status === 'approved' ? 'تمت الموافقة' : 'تم الرفض'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveServices;