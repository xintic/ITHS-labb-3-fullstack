import logo from '@/assets/petly-logo.svg';
import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
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
  const [open, setOpen] = useState(false);

  const closeSheet = () => setOpen(false);

  return (
    <nav className="flex flex-col px-4 md:px-8 lg:px-16 xl:px-32 h-28 lg:h-45">
      <div className="flex flex-row items-center h-20">
        <div className="flex items-center">
          <NavLink to="/">
            <img src={logo} alt="Petly logga" />
          </NavLink>
        </div>
        <div className="lg:hidden ml-auto">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <div className="cursor-pointer h-10 w-10 flex items-center justify-center">
                <LuMenu className="h-8 w-8" />
              </div>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[350px] h-full flex flex-col justify-between"
              aria-describedby={undefined}
            >
              <div>
                <SheetTitle className="p-4.5 text-xl">Meny</SheetTitle>
                <div className="mb-4 px-2">
                  <Search />
                </div>
                <Accordion type="single" collapsible className="px-2">
                  <AccordionItem value="hund">
                    <AccordionTrigger>Allt inom Hund</AccordionTrigger>
                    <AccordionContent className="flex flex-col space-y-2 pl-4">
                      {[
                        'hundmat',
                        'matplats',
                        'godis',
                        'apotek',
                        'skotsel',
                        'leksaker',
                        'sovplats',
                        'promenad',
                        'klader',
                        'burar',
                        'traning',
                        'tillbehor',
                        'for-husse-och-matte'
                      ].map((slug) => (
                        <Link to={`/hund/${slug}`} key={slug} onClick={closeSheet}>
                          {slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="katt">
                    <AccordionTrigger>Allt inom Katt</AccordionTrigger>
                    <AccordionContent className="flex flex-col space-y-2 pl-4">
                      {[
                        'kattmat',
                        'matplats',
                        'godis',
                        'apotek',
                        'skotsel',
                        'leksaker',
                        'sovplats',
                        'kattlador',
                        'kattsand',
                        'utekatt',
                        'burar',
                        'tillbehor',
                        'klosmobler'
                      ].map((slug) => (
                        <Link to={`/katt/${slug}`} key={slug} onClick={closeSheet}>
                          {slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="smadjur">
                    <AccordionTrigger>Allt inom Smådjur</AccordionTrigger>
                    <AccordionContent className="flex flex-col space-y-2 pl-4">
                      {[
                        'kanin',
                        'marsvin',
                        'hamster',
                        'fågel',
                        'akvariefisk',
                        'reptil',
                        'ovriga'
                      ].map((slug) => (
                        <Link to={`/smadjur/${slug}`} key={slug} onClick={closeSheet}>
                          {slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <div className="flex flex-col gap-2 px-4 pb-4">
                <Cart />
                <UserDialog />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden lg:flex flex-row items-center justify-end gap-2 ml-auto">
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
      <div className="hidden lg:flex flex-row justify-center items-center space-x-4 text-m h-10">
        <NavLink to="/hund">Allt inom Hund</NavLink>
        <NavLink to="/katt">Allt inom Katt</NavLink>
        <NavLink to="/smadjur">Allt inom Smådjur</NavLink>
        <NavLink to="/presentkort">Presentkort</NavLink>
      </div>
      <Separator className="my-2 hidden lg:block" />
    </nav>
  );
};

export default Navbar;
