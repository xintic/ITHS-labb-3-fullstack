import logo from '@/assets/petly-logo.svg';
import { NavLink, Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import Cart from '@/components/Cart';
import UserDialog from '@/components/UserDialog';
import Search from '@/components/Search';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { LuMenu } from 'react-icons/lu';

const Navbar = () => {
  return (
    <nav className="flex flex-col px-4 md:px-8 lg:px-16 xl:px-32 h-45">
      <div className="flex flex-row items-center h-20">
        <div className="flex items-center">
          <NavLink to="/">
            <img src={logo} alt="Petly logga" />
          </NavLink>
        </div>
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <div className="cursor-pointer h-10 w-10 flex items-center justify-center">
                <LuMenu className="h-8 w-8" />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px]" aria-describedby={undefined}>
              <SheetTitle className="p-4.5 text-xl">Meny</SheetTitle>
              <div className="gap-2 mb-4">
                <Cart />
                <UserDialog />
              </div>
              <div className="mb-4 px-2">
                <Search />
              </div>
              <Accordion type="single" collapsible className="px-2">
                <AccordionItem value="hund">
                  <AccordionTrigger>Allt inom Hund</AccordionTrigger>
                  <AccordionContent className="flex flex-col space-y-2 pl-4">
                    <Link to="/hund/hundmat">Hundmat</Link>
                    <Link to="/hund/matplats">Hundens Matplats</Link>
                    <Link to="/hund/godis">Hundgodis</Link>
                    <Link to="/hund/apotek">Hundens Apotek</Link>
                    <Link to="/hund/skotsel">Hundens Skötsel</Link>
                    <Link to="/hund/leksaker">Hundleksaker</Link>
                    <Link to="/hund/sovplats">Hundens Sovplats</Link>
                    <Link to="/hund/promenad">Hundpromenad</Link>
                    <Link to="/hund/klader">Hundkläder</Link>
                    <Link to="/hund/burar">Hundburar</Link>
                    <Link to="/hund/traning">Hundträning</Link>
                    <Link to="/hund/tillbehor">Hundtillbehör</Link>
                    <Link to="/hund/for-husse-och-matte">För Husse & Matte</Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="katt">
                  <AccordionTrigger>Allt inom Katt</AccordionTrigger>
                  <AccordionContent className="flex flex-col space-y-2 pl-4">
                    <Link to="/katt/kattmat">Kattmat</Link>
                    <Link to="/katt/matplats">Kattens Matplats</Link>
                    <Link to="/katt/godis">Kattgodis</Link>
                    <Link to="/katt/apotek">Kattens Apotek</Link>
                    <Link to="/katt/skotsel">Kattens Skötsel</Link>
                    <Link to="/katt/leksaker">Kattleksaker</Link>
                    <Link to="/katt/sovplats">Kattens Sovplats</Link>
                    <Link to="/katt/kattlador">Kattlådor</Link>
                    <Link to="/katt/kattsand">Kattsand</Link>
                    <Link to="/katt/utekatt">Till Utekatten</Link>
                    <Link to="/katt/burar">Kattburar</Link>
                    <Link to="/katt/tillbehor">Kattillbehör</Link>
                    <Link to="/katt/klosmobler">Klösmöbler</Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="smadjur">
                  <AccordionTrigger>Allt inom Smådjur</AccordionTrigger>
                  <AccordionContent className="flex flex-col space-y-2 pl-4">
                    <Link to="/smadjur/kanin">Kanin</Link>
                    <Link to="/smadjur/marsvin">Marsvin</Link>
                    <Link to="/smadjur/hamster">Hamster</Link>
                    <Link to="/smadjur/fågel">Fågel</Link>
                    <Link to="/smadjur/akvariefisk">Akvariefisk</Link>
                    <Link to="/smadjur/reptil">Reptil</Link>
                    <Link to="/smadjur/ovriga">Övriga</Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden md:flex flex-row items-center justify-end gap-2 ml-auto">
          <div className="flex-shrink-0">
            <Cart />
          </div>
          <div className="flex-shrink-0">
            <UserDialog />
          </div>
          <div className="w-[30rem]">
            <Search />
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      <div className="hidden md:flex flex-row justify-center items-center space-x-4 text-m h-10">
        <NavLink to="/hund">Allt inom Hund</NavLink>
        <NavLink to="/katt">Allt inom Katt</NavLink>
        <NavLink to="/smadjur">Allt inom Smådjur</NavLink>
        <NavLink to="/presentkort">Presentkort</NavLink>
      </div>

      <Separator className="my-2 hidden md:block" />
    </nav>
  );
};

export default Navbar;
