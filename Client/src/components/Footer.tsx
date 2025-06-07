import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LuFacebook, LuInstagram, LuTwitter, LuMail } from 'react-icons/lu';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 pt-10 pb-6">
      <div className="px-4 md:px-8 lg:px-16 xl:px-32">
        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div>
            <h2 className="text-xl font-bold mb-2">Petly</h2>
            <p className="text-sm text-gray-600">
              Produkter och tjänster för dig och ditt husdjur.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link to="/about" className="hover:text-black transition">
              Om oss
            </Link>
            <Link to="/help" className="hover:text-black transition">
              Kundservice
            </Link>
            <Link to="/terms" className="hover:text-black transition">
              Köpvillkor
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="newsletter" className="text-sm font-medium text-gray-900">
              Prenumerera på nyheter
            </label>
            <div className="flex gap-2">
              <Input
                id="newsletter"
                placeholder="Din e-post"
                className="bg-amber-50 border border-gray-300"
              />
              <Button>Prenumerera</Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Petly. Alla rättigheter förbehållna.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-black">
              <LuFacebook size={18} />
            </Link>
            <Link to="#" className="hover:text-black">
              <LuInstagram size={18} />
            </Link>
            <Link to="#" className="hover:text-black">
              <LuTwitter size={18} />
            </Link>
            <a href="mailto:info@minbutik.se" className="hover:text-black">
              <LuMail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
