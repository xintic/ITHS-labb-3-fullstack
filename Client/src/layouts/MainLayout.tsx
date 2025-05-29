import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const MainLayout = () => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      {location.pathname !== '/' && <Breadcrumbs />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
