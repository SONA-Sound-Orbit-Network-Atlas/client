import { createBrowserRouter } from 'react-router-dom';
import Main from '@/pages/main/Main';
import GalaxyPage from '@/pages/GalaxyPage';
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
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
