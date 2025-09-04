import { NavLink, Outlet } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen bg-background p-8 pt-20">
      <nav className="space-x-4 fixed top-0 left-0 right-0 w-full z-100 py-6 px-8 bg-gray-bg">
        <NavLink
          to="common"
          className={({ isActive }) =>
            isActive ? 'text-primary font-bold' : 'text-gray-500'
          }
        >
          Common 컴포넌트 보기
        </NavLink>

        <NavLink
          to="panel"
          className={({ isActive }) =>
            isActive ? 'text-primary font-bold' : 'text-gray-500'
          }
        >
          Panel 컴포넌트 보기
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
