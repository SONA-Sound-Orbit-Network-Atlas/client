import { createBrowserRouter } from 'react-router-dom';
import Main from '@/pages/Main';
import SpacePage from '@/pages/SpacePage';
import ComponentTestPage from '@/pages/ComponentTestPage';
import AudioTestPage from '@/pages/AudioTestPage';
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
    path: '/audio-test',
    element: <AudioTestPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
