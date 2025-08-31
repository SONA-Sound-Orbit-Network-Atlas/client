import { createBrowserRouter } from 'react-router-dom';
import Main from '@/pages/main/Main';
import GalaxyPage from '@/pages/GalaxyPage';
import NotFound from '@/pages/NotFound';
import ComponentsPage from '@/pages/componentsPage/ComponentsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/galaxy',
    element: <GalaxyPage />,
  },
  {
    path: '/componentsPage',
    element: <ComponentsPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
