import { createBrowserRouter } from 'react-router-dom';
import Main from '@/pages/Main';
import SpacePage from '@/pages/SpacePage';
import ComponentTestPage from '@/pages/ComponentTestPage';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/space',
    element: <SpacePage />,
  },
  {
    path: '/componentstest',
    element: <ComponentTestPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
