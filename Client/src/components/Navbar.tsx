import { NavLink } from 'react-router-dom';
import logo from '@/assets/petly-logo.webp';
const Navbar = () => {
  return (
    <nav>
      <div>
        <NavLink to="/" className={({ isActive }) => (isActive ? '' : '')}>
          <img src={logo} alt="Petly" />
          Hem
        </NavLink>
        <NavLink to="/hund" className={({ isActive }) => (isActive ? '' : '')}>
          Allt inom Hund
        </NavLink>
        <NavLink to="/katt" className={({ isActive }) => (isActive ? '' : '')}>
          Allt inom Katt
        </NavLink>
        <NavLink to="/smadjur" className={({ isActive }) => (isActive ? '' : '')}>
          Allt inom Smådjur
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
