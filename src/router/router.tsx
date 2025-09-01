import { createBrowserRouter } from 'react-router-dom';
import Main from '@/pages/main/Main';
import GalaxyPage from '@/pages/GalaxyPage';
import AudioTestPage from '@/pages/AudioTestPage';
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
    path: '/audio-test',
    element: <AudioTestPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
