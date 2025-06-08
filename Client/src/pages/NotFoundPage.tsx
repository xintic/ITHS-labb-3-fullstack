import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <div className="bg-primary shadow-lg rounded-xl p-8 flex flex-col items-center">
      <h1 className="text-6xl font-extrabold text-white mb-4">404</h1>
      <p className="text-xl text-white mb-2 font-semibold">Sidan kunde inte hittas</p>
      <p className="text-white mb-6">
        Oops! Sidan du söker finns inte, är borttagen eller har flyttats.
      </p>
      <Link to="/">
        <Button variant="outline" size="lg">
          Till startsidan
        </Button>
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
