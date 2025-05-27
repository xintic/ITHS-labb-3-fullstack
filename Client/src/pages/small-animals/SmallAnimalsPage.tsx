import { Link, Outlet } from 'react-router-dom';

const SmallAnimalsPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-xl font-bold">Allt inom Smådjur</h1>
      <nav className="mt-2 space-x-4">
        <Link to="kanin" className="text-blue-500 underline">
          Kanin
        </Link>
        <Link to="marsvin" className="text-blue-500 underline">
          Marsvin
        </Link>
        <Link to="hamster" className="text-blue-500 underline">
          Hamster
        </Link>
        <Link to="fagel" className="text-blue-500 underline">
          Fågel
        </Link>
        <Link to="akvariefisk" className="text-blue-500 underline">
          Akvariefisk
        </Link>
        <Link to="reptil" className="text-blue-500 underline">
          Reptil
        </Link>
        <Link to="ovriga" className="text-blue-500 underline">
          Övriga Smådjur
        </Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default SmallAnimalsPage;
