import logo from '@/assets/petly-logo.svg';
import { NavLink } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { LuShoppingCart } from 'react-icons/lu';
import UserDialog from '@/components/UserDialog';
import Search from '@/components/Search';

const Navbar = () => {
  return (
    <nav className="flex flex-col p-4 sm:p-6">
      <div className="flex flex-row justify-between items-center">
        <div className="flex">
          <NavLink to="/" className={({ isActive }) => (isActive ? '' : '')}>
            <img src={logo} alt="Petly logga" />
          </NavLink>
        </div>
        <div className="flex flex-row items-center w-full max-w-2xl ml-auto">
          <Button variant="ghost">
            <LuShoppingCart />
          </Button>
          <UserDialog />
          <div className="flex-1">
            <Search />
          </div>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-row justify-center h-10 items-center space-x-4 text-m">
        <NavLink to="/hund" className={({ isActive }) => (isActive ? '' : '')}>
          Allt inom Hund
        </NavLink>
        <NavLink to="/katt" className={({ isActive }) => (isActive ? '' : '')}>
          Allt inom Katt
        </NavLink>
        <NavLink to="/smadjur" className={({ isActive }) => (isActive ? '' : '')}>
          Allt inom Smådjur
        </NavLink>
        <NavLink to="/presentkort" className={({ isActive }) => (isActive ? '' : '')}>
          Presentkort
        </NavLink>
      </div>
      <Separator className="my-2" />
    </nav>
  );
};

export default Navbar;
