import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Hospital {
  id: string;
  name: string;
  nameEn: string;
  type: 'hospital' | 'specialized_center';
  centers: HealthCenter[];
}

interface HealthCenter {
  id: string;
  name: string;
  nameEn: string;
  hospitalId: string;
}

interface DataContextType {
  hospitals: Hospital[];
  statistics: {
    facilities: number;
    healthCenters: number;
    departments: number;
    dailyPatients: number;
  };
  heroImages: string[];
  news: any[];
  services: any[];
  announcements: any[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialHospitals: Hospital[] = [
  {
    id: '1',
    name: 'مستشفى الملك خالد',
    nameEn: 'King Khalid Hospital',
    type: 'hospital',
    centers: [
      { id: '1-1', name: 'مركز صحي الخالدية', nameEn: 'Khalidiya Health Center', hospitalId: '1' },
      { id: '1-2', name: 'مركز صحي الضيافة', nameEn: 'Diyafa Health Center', hospitalId: '1' },
      { id: '1-3', name: 'مركز صحي الأمير مشعل', nameEn: 'Prince Mishal Health Center', hospitalId: '1' },
      { id: '1-4', name: 'مركز صحي بئر عسكر', nameEn: 'Bir Askar Health Center', hospitalId: '1' },
      { id: '1-5', name: 'مركز صحي حي الفهد الشمالي', nameEn: 'North Fahd District Health Center', hospitalId: '1' },
      { id: '1-6', name: 'مركز صحي الكنتوب', nameEn: 'Kantob Health Center', hospitalId: '1' },
      { id: '1-7', name: 'مركز صحي الفيصلية', nameEn: 'Faisaliya Health Center', hospitalId: '1' },
      { id: '1-8', name: 'مركز صحي عاكفة', nameEn: 'Akifa Health Center', hospitalId: '1' },
      { id: '1-9', name: 'مركز صحي الضباط', nameEn: 'Officers Health Center', hospitalId: '1' },
      { id: '1-10', name: 'مركز السكري والغدد الصماء', nameEn: 'Diabetes & Endocrinology Center', hospitalId: '1' },
      { id: '1-11', name: 'مركز الأورام', nameEn: 'Oncology Center', hospitalId: '1' }
    ]
  },
  {
    id: '2',
    name: 'مركز الأمير سلطان لأمراض القلب',
    nameEn: 'Prince Sultan Center for Heart Diseases',
    type: 'specialized_center',
    centers: []
  },
  {
    id: '3',
    name: 'مركز الأمير سلطان لأمراض الكلى',
    nameEn: 'Prince Sultan Center for Kidney Diseases',
    type: 'specialized_center',
    centers: []
  },
  {
    id: '4',
    name: 'مستشفى نجران البلد',
    nameEn: 'Najran City Hospital',
    type: 'hospital',
    centers: [
      { id: '4-1', name: 'مركز حي نهوقة', nameEn: 'Nahoqa District Center', hospitalId: '4' },
      { id: '4-2', name: 'مركز صحي البلد', nameEn: 'City Health Center', hospitalId: '4' },
      { id: '4-3', name: 'مركز صحي الموفجة', nameEn: 'Mowfaja Health Center', hospitalId: '4' },
      { id: '4-4', name: 'مركز صحي الشبهان', nameEn: 'Shabhan Health Center', hospitalId: '4' },
      { id: '4-5', name: 'مركز صحي أبا السعود', nameEn: 'Aba Alsaoud Health Center', hospitalId: '4' },
      { id: '4-6', name: 'مركز صحي الحضن', nameEn: 'Hadn Health Center', hospitalId: '4' },
      { id: '4-7', name: 'مركز صحي المراطة', nameEn: 'Marata Health Center', hospitalId: '4' },
      { id: '4-8', name: 'مركز صحي دحضة', nameEn: 'Dahda Health Center', hospitalId: '4' },
      { id: '4-9', name: 'مركز صحي الجربة', nameEn: 'Jarba Health Center', hospitalId: '4' },
      { id: '4-10', name: 'مركز صحي الصفا', nameEn: 'Safa Health Center', hospitalId: '4' },
      { id: '4-11', name: 'مركز صحي القابل', nameEn: 'Qabel Health Center', hospitalId: '4' },
      { id: '4-12', name: 'مركز صحي شعب رير', nameEn: 'Shab Rir Health Center', hospitalId: '4' }
    ]
  },
  // Additional hospitals would be added here following the same pattern
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hospitals] = useState<Hospital[]>(initialHospitals);
  
  const statistics = {
    facilities: 15,
    healthCenters: 89,
    departments: 45,
    dailyPatients: 2847
  };

  // جميع الصور المرسلة مسبقاً - بدون 04.png
  const heroImages = [
    '/3bdb653c-3f39-43eb-943f-22da6e80b8f7.jfif',
    '/758.jpeg',
    '/984.jfif',
    '/9877777.jpg',
    '/لكن.jfif',
    '/معا.jpeg',
    '/عملنا.jfif',
    '/قدرتك.jfif',
    '/كل يوم.jfif',
    '/كن رائداً.jfif',
    '/كل يوم افضل.jfif',
    '/مصلحة المريض.jfif',
    '/قوتكم واصراركم.jfif',
    '/هدفنا صحة المجتمع.jfif',
    '/E7ZsvYAXEAMckXY.jpg',
    '/E7ZsvYAXEAMckXY copy.jpg',
    '/100.png',
    '/101.png',
    '/102.png',
    '/103.png',
    '/104.png'
  ];

  const news = [
    {
      id: '1',
      title: 'افتتاح وحدة جديدة للعناية المركزة',
      titleEn: 'Opening of New Intensive Care Unit',
      date: '2025-01-15',
      content: 'تم افتتاح وحدة جديدة للعناية المركزة بأحدث التقنيات الطبية...'
    }
  ];

  const services = [
    {
      id: '1',
      name: 'الخدمات الطارئة',
      nameEn: 'Emergency Services',
      description: 'خدمات طوارئ على مدار 24 ساعة'
    }
  ];

  const announcements = [
    {
      id: '1',
      title: 'تحديث نظام المواعيد الإلكترونية',
      titleEn: 'Electronic Appointment System Update',
      date: '2025-01-10'
    }
  ];

  return (
    <DataContext.Provider 
      value={{
        hospitals,
        statistics,
        heroImages,
        news,
        services,
        announcements
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};