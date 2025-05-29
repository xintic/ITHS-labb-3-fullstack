import { Link, Outlet } from 'react-router-dom';

const DogPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-xl font-bold hidden md:block">Allt inom Hund</h1>
      <nav className="mt-2 space-x-4 hidden md:block">
        <Link to="hundmat" className="text-blue-500 underline">
          Hundmat
        </Link>
        <Link to="matplats" className="text-blue-500 underline">
          Hundens Matplats
        </Link>
        <Link to="godis" className="text-blue-500 underline">
          Hundgodis
        </Link>
        <Link to="apotek" className="text-blue-500 underline">
          Hundens Apotek
        </Link>
        <Link to="skotsel" className="text-blue-500 underline">
          Hundens Skötsel
        </Link>
        <Link to="leksaker" className="text-blue-500 underline">
          Hundleksaker
        </Link>
        <Link to="sovplats" className="text-blue-500 underline">
          Hundens Sovplats
        </Link>
        <Link to="promenad" className="text-blue-500 underline">
          Hundpromenad
        </Link>
        <Link to="klader" className="text-blue-500 underline">
          Hundkläder
        </Link>
        <Link to="burar" className="text-blue-500 underline">
          Hundburar
        </Link>
        <Link to="traning" className="text-blue-500 underline">
          Hundträning
        </Link>
        <Link to="tillbehor" className="text-blue-500 underline">
          Hundtillbehör
        </Link>
        <Link to="for-husse-och-matte" className="text-blue-500 underline">
          För Husse & Matte
        </Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default DogPage;
