import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId?: string;
  requestNumber?: string;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, requestId, requestNumber }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleRatingSubmit = () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to save rating
    setTimeout(() => {
      setIsSubmitting(false);
      setRatingSubmitted(true);
      
      // Send notification to system admin
      addNotification({
        title: language === 'ar' ? 'تقييم جديد للخدمة' : 'New Service Rating',
        message: language === 'ar' 
          ? `تم استلام تقييم جديد (${rating}/5) ${requestNumber ? `للطلب رقم ${requestNumber}` : ''} من ${user?.name}`
          : `New rating (${rating}/5) ${requestNumber ? `for request ${requestNumber}` : ''} received from ${user?.name}`,
        timestamp: new Date().toISOString(),
        type: 'info',
        relatedId: requestId
      });
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
        // Reset state for next time
        setRating(0);
        setHoverRating(0);
        setFeedbackText('');
        setRatingSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl animate-fade-in">
        {ratingSubmitted ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'شكراً لتقييمك!' : 'Thank you for your feedback!'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'ar' 
                ? 'تساعدنا ملاحظاتك في تحسين خدماتنا'
                : 'Your feedback helps us improve our services'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'قيّم تجربتك معنا' : 'Rate Your Experience'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'سعياً منا للتطوير، شاركنا في تقييم خدمات المنصة الرقمية المقدمة'
                  : 'Help us improve by rating our digital platform services'
                }
              </p>
              {requestNumber && (
                <p className="text-sm text-blue-600 mt-2">
                  {language === 'ar' 
                    ? `الطلب رقم: ${requestNumber}`
                    : `Request #: ${requestNumber}`
                  }
                </p>
              )}
            </div>
            
            <div className="flex justify-center space-x-2 rtl:space-x-reverse mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'ملاحظاتك (اختياري)' : 'Your Feedback (Optional)'}
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'ar' 
                  ? 'شاركنا بملاحظاتك لتحسين خدماتنا...'
                  : 'Share your feedback to help us improve our services...'
                }
              />
            </div>
            
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                onClick={handleRatingSubmit}
                disabled={rating === 0 || isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>{language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <span>{language === 'ar' ? 'إرسال التقييم' : 'Submit Rating'}</span>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RatingModal;