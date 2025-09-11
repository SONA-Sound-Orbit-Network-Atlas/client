// GALAXY > My (내 항성계 리스트)

import List from './List';
import PanelTitle from '../../PanelTitle';
import CreateNewButton from './CreateNewButton';
import LoginRequired from '@/components/panel/LoginRequired';
import { useUserStore } from '@/stores/useUserStore';

export default function GalaxyMy() {
  // 로그인 여부 체크
  const { isLoggedIn } = useUserStore();
  if (!isLoggedIn) return <LoginRequired />;

  return (
    <div>
      {/* 새 항성계 생성 버튼 */}
      <CreateNewButton />

      {/* 내 항성계 리스트 */}
      <section className="mt-6">
        <PanelTitle>MY SYSTEMS</PanelTitle>
        <List />
      </section>
    </div>
  );
}
