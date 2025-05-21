import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import DogPage from './pages/DogPage';
import CatPage from './pages/CatPage';
import SmallAnimalsPage from './pages/SmallAnimalsPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<LandingPage />} />
      <Route path="/hund" element={<DogPage />} />
      <Route path="/katt" element={<CatPage />} />
      <Route path="/smadjur" element={<SmallAnimalsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
