import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
          Välkommen till Petly – Din butik för allt till djur!
        </h1>
        <p className="text-lg md:text-xl mb-10 text-gray-600 max-w-2xl">
          Upptäck ett stort sortiment av produkter, snabba leveranser och personlig service.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link to="/">
            <Button size="lg">Handla nu</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg">
              Skapa konto
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
