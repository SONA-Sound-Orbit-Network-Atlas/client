import { createBrowserRouter, Navigate } from 'react-router-dom';
import Main from '@/pages/Main';
import SpacePage from '@/pages/SpacePage';
import PanelComponent from '@/pages/componentstest/Panel';
import NotFoundPage from '@/pages/NotFoundPage';
import ComponentTestPage from '@/pages/componentstest/Index';
import CommonComponent from '@/pages/componentstest/Common';
import AudioTestPage from '@/pages/AudioTestPage';

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
    children: [
      {
        index: true,
        element: <Navigate to="common" replace />,
      },
      {
        path: 'common',
        element: <CommonComponent />,
      },
      {
        path: 'panel',
        element: <PanelComponent />,
      },
    ],
  },
  {
    path: '/audio-test',
    element: <AudioTestPage />,
  },
  {
    path: '/audio-test',
    element: <AudioTestPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
