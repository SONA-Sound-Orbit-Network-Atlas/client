import { createBrowserRouter } from 'react-router-dom';
import Main from '@/pages/Main';
import SpacePage from '@/pages/SpacePage';
import Panel from '@/pages/componentstest/Panel';
import NotFoundPage from '@/pages/NotFoundPage';
import Index from '@/pages/componentstest/Index';
import Common from '@/pages/componentstest/Common';

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
    element: <Index />,
    children: [
      {
        path: 'common',
        element: <Common />,
      },
      {
        path: 'panel',
        element: <Panel />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
