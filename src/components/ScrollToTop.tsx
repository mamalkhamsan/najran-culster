import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // التمرير إلى أعلى الصفحة عند تغيير المسار
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // تمرير ناعم
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;