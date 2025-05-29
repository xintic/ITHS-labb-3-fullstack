import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

const TRANSLATIONS: Record<string, string> = {
  hund: 'Hund',
  hundmat: 'Hundmat',
  matplats: 'Hundens Matplats',
  godis: 'Hundgodis',
  apotek: 'Hundens Apotek',
  skotsel: 'Hundens Skötsel',
  leksaker: 'Hundleksaker',
  sovplats: 'Hundens Sovplats',
  promenad: 'Hundpromenad',
  klader: 'Hundkläder',
  burar: 'Hundburar',
  traning: 'Hundträning',
  tillbehor: 'Hundtillbehör',
  'for-husse-och-matte': 'För Husse & Matte',
  katt: 'Katt',
  kattmat: 'Kattmat',
  kattlador: 'Kattlådor',
  kattsand: 'Kattsand',
  utekatt: 'Till Utekatten',
  klosmobler: 'Klösmöbler',
  smadjur: 'Smådjur',
  kanin: 'Kanin',
  marsvin: 'Marsvin',
  hamster: 'Hamster',
  fagel: 'Fågel',
  akvariefisk: 'Akvariefisk',
  reptil: 'Reptil',
  ovriga: 'Övriga',
  presentkort: 'Presentkort',
  sok: 'Sök',
  anvandare: 'Mina sidor',
  produkt: 'Produkt'
};

export default function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  const [productName, setProductName] = useState<string | null>(null);

  useEffect(() => {
    if (paths[0] === 'produkt' && paths[1]) {
      axios
        .get(`/api/products/${paths[1]}`)
        .then((res) => setProductName(res.data.name))
        .catch(() => setProductName(null));
    }
  }, [paths]);

  const breadcrumbs = paths.flatMap((segment, idx) => {
    const path = '/' + paths.slice(0, idx + 1).join('/');
    const isLast = idx === paths.length - 1;

    let label: string;
    if (paths[0] === 'produkt' && idx === 1 && productName) {
      label = productName;
    } else if (TRANSLATIONS[segment]) {
      label = TRANSLATIONS[segment];
    } else {
      label = segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }

    return [
      <BreadcrumbSeparator key={`${path}-sep`} />,
      <BreadcrumbItem key={path}>
        {isLast ? (
          <BreadcrumbPage className="truncate max-w-[10rem] sm:max-w-none sm:whitespace-normal">
            {label}
          </BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link to={path}>{label}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    ];
  });

  return (
    <Breadcrumb className="px-4 md:px-8 lg:px-16 xl:px-32">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Hem</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
