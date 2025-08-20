import { createBrowserRouter } from 'react-router-dom';
import Main from '@/pages/main/Main';
import StellarSystem from '@/pages/StellarSystem';
import NotFound from '@/pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/stellar-system',
    element: <StellarSystem />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
