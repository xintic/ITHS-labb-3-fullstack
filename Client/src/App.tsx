import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import UserPage from './pages/UserPage';
import AdminPanelPage from './pages/AdminPanelPage';
import ProtectedRoute from './components/ProtectedRoute';

import DogPage from './pages/dog/DogPage';
import DogFoodPage from './pages/dog/DogFoodPage';
import DogFeedingAreaPage from './pages/dog/DogFeedingAreaPage';
import DogTreatsPage from './pages/dog/DogTreatsPage';
import DogPharmacyPage from './pages/dog/DogPharmacyPage';
import DogCarePage from './pages/dog/DogCarePage';
import DogToysPage from './pages/dog/DogToysPage';
import DogBedsPage from './pages/dog/DogBedsPage';
import DogWalkingPage from './pages/dog/DogWalkingPage';
import DogClothesPage from './pages/dog/DogClothesPage';
import DogCratesPage from './pages/dog/DogCratesPage';
import DogTrainingPage from './pages/dog/DogTrainingPage';
import DogAccessoriesPage from './pages/dog/DogAccessoriesPage';
import ForPetOwnersPage from './pages/dog/ForPetOwnersPage';

import CatPage from './pages/cat/CatPage';
import CatFoodPage from './pages/cat/CatFoodPage';
import CatFeedingAreaPage from './pages/cat/CatFeedingAreaPage';
import CatTreatsPage from './pages/cat/CatTreatsPage';
import CatPharmacyPage from './pages/cat/CatPharmacyPage';
import CatCarePage from './pages/cat/CatCarePage';
import CatToysPage from './pages/cat/CatToysPage';
import CatBedsPage from './pages/cat/CatBedsPage';
import CatLitterBoxesPage from './pages/cat/CatLitterBoxesPage';
import CatLitterPage from './pages/cat/CatLitterPage';
import OutdoorCatsPage from './pages/cat/OutdoorCatsPage';
import CatCratesPage from './pages/cat/CatCratesPage';
import CatAccessoriesPage from './pages/cat/CatAccessoriesPage';
import CatScratchingFurniturePage from './pages/cat/CatScratchingFurniturePage';

import SmallAnimalsPage from './pages/small-animals/SmallAnimalsPage';
import RabbitPage from './pages/small-animals/RabbitPage';
import GuineaPigPage from './pages/small-animals/GuineaPigPage';
import HamsterPage from './pages/small-animals/HamsterPage';
import BirdPage from './pages/small-animals/BirdPage';
import AquariumFishPage from './pages/small-animals/AquariumFishPage';
import ReptilePage from './pages/small-animals/ReptilePage';
import OtherSmallAnimalsPage from './pages/small-animals/OtherSmallAnimalsPage';

import ProductDetailPage from './pages/ProductDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import GiftCardsPage from './pages/GiftCardsPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<LandingPage />} />
      <Route path="hund" element={<DogPage />}>
        <Route path="hundmat" element={<DogFoodPage />} />
        <Route path="matplats" element={<DogFeedingAreaPage />} />
        <Route path="godis" element={<DogTreatsPage />} />
        <Route path="apotek" element={<DogPharmacyPage />} />
        <Route path="skotsel" element={<DogCarePage />} />
        <Route path="leksaker" element={<DogToysPage />} />
        <Route path="sovplats" element={<DogBedsPage />} />
        <Route path="promenad" element={<DogWalkingPage />} />
        <Route path="klader" element={<DogClothesPage />} />
        <Route path="burar" element={<DogCratesPage />} />
        <Route path="traning" element={<DogTrainingPage />} />
        <Route path="tillbehor" element={<DogAccessoriesPage />} />
        <Route path="for-husse-och-matte" element={<ForPetOwnersPage />} />
      </Route>
      <Route path="katt" element={<CatPage />}>
        <Route path="kattmat" element={<CatFoodPage />} />
        <Route path="matplats" element={<CatFeedingAreaPage />} />
        <Route path="godis" element={<CatTreatsPage />} />
        <Route path="apotek" element={<CatPharmacyPage />} />
        <Route path="skotsel" element={<CatCarePage />} />
        <Route path="leksaker" element={<CatToysPage />} />
        <Route path="sovplats" element={<CatBedsPage />} />
        <Route path="kattlador" element={<CatLitterBoxesPage />} />
        <Route path="kattsand" element={<CatLitterPage />} />
        <Route path="utekatt" element={<OutdoorCatsPage />} />
        <Route path="burar" element={<CatCratesPage />} />
        <Route path="tillbehor" element={<CatAccessoriesPage />} />
        <Route path="klosmobler" element={<CatScratchingFurniturePage />} />
      </Route>
      <Route path="smadjur" element={<SmallAnimalsPage />}>
        <Route path="kanin" element={<RabbitPage />} />
        <Route path="marsvin" element={<GuineaPigPage />} />
        <Route path="hamster" element={<HamsterPage />} />
        <Route path="fagel" element={<BirdPage />} />
        <Route path="akvariefisk" element={<AquariumFishPage />} />
        <Route path="reptil" element={<ReptilePage />} />
        <Route path="ovriga" element={<OtherSmallAnimalsPage />} />
      </Route>
      <Route path="presentkort" element={<GiftCardsPage />} />
      <Route path="/produkt/:slug" element={<ProductDetailPage />} />
      <Route path="/sok" element={<SearchResultsPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/anvandare" element={<UserPage />} />
      </Route>
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin/hantera-produkt" element={<AdminPanelPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
