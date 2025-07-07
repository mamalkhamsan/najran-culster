import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext'; 
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import StatisticsPage from './pages/StatisticsPage';
import NewsPage from './pages/NewsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import FAQPage from './pages/FAQPage';
import HospitalsContactPage from './pages/HospitalsContactPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PlatformHome from './pages/platform/PlatformHome';
import Dashboard from './pages/platform/Dashboard';
import Inbox from './pages/platform/Inbox';
import Documents from './pages/platform/Documents';
import Reminders from './pages/platform/Reminders';
import Profile from './pages/platform/Profile';
import LiveDisplay from './pages/platform/LiveDisplay';
import RequestService from './pages/platform/RequestService';
import ProcessRequests from './pages/platform/ProcessRequests';
import AdminPanel from './pages/admin/AdminPanel';
import ApproveServices from './pages/admin/ApproveServices';
import SubmitComplaint from './pages/platform/SubmitComplaint';
import ComplaintHistory from './pages/platform/ComplaintHistory';
import ComplaintsManagement from './pages/admin/ComplaintsManagement';
import DigitalServicesPage from './pages/DigitalServicesPage';
import RatingsManagement from './pages/admin/RatingsManagement';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/statistics" element={<StatisticsPage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/hospitals-contact" element={<HospitalsContactPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/digital-services" element={<DigitalServicesPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/platform" element={<PlatformHome />} />
                    <Route path="/platform/dashboard" element={<Dashboard />} />
                    <Route path="/platform/inbox" element={<Inbox />} />
                    <Route path="/platform/documents" element={<Documents />} />
                    <Route path="/platform/reminders" element={<Reminders />} />
                    <Route path="/platform/profile" element={<Profile />} />
                    <Route path="/platform/live-display" element={<LiveDisplay />} />
                    <Route path="/platform/request-service" element={<RequestService />} />
                    <Route path="/platform/submit-complaint" element={<SubmitComplaint />} />
                    <Route path="/platform/complaint-history" element={<ComplaintHistory />} />
                    <Route path="/platform/process-requests" element={<ProcessRequests />} />
                    <Route path="/admin/*" element={<AdminPanel />} />
                    <Route path="/admin/ratings" element={<RatingsManagement />} />
                    <Route path="/admin/complaints" element={<ComplaintsManagement />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;