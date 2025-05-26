import { Link, Outlet } from 'react-router-dom';

const DogPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Allt inom Katt</h1>
      <nav className="mt-2 space-x-4">
        <Link to="kattmat" className="text-blue-500 underline">
          Kattmat
        </Link>
        <Link to="matplats" className="text-blue-500 underline">
          Kattens Matplats
        </Link>
        <Link to="godis" className="text-blue-500 underline">
          Kattgodis
        </Link>
        <Link to="apotek" className="text-blue-500 underline">
          Kattens Apotek
        </Link>
        <Link to="skotsel" className="text-blue-500 underline">
          Kattens Skötsel
        </Link>
        <Link to="leksaker" className="text-blue-500 underline">
          Kattleksaker
        </Link>
        <Link to="sovplats" className="text-blue-500 underline">
          Kattens Sovplats
        </Link>
        <Link to="kattlador" className="text-blue-500 underline">
          Kattlådor
        </Link>
        <Link to="kattsand" className="text-blue-500 underline">
          Kattsand
        </Link>
        <Link to="utekatt" className="text-blue-500 underline">
          Till Utekatten
        </Link>
        <Link to="burar" className="text-blue-500 underline">
          Kattburar
        </Link>
        <Link to="tillbehor" className="text-blue-500 underline">
          Katttillbehör
        </Link>
        <Link to="klosmobler" className="text-blue-500 underline">
          Klösmöbler
        </Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default DogPage;
