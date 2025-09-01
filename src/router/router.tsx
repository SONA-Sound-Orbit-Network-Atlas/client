import { createBrowserRouter } from 'react-router-dom';
import Main from '@/pages/main/Main';
import GalaxyPage from '@/pages/GalaxyPage';
import ComponentTestPage from '@/pages/ComponentTestPage';
import NotFound from '@/pages/NotFound';

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
    path: '/componentstest',
    element: <ComponentTestPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
