// GALAXY > My (내 항성계 리스트)

import List from './List';
import PanelTitle from '../../PanelTitle';
import CreateNewButton from './CreateNewButton';
import { useGetSession } from '@/hooks/api/useAuth';
import LoginRequired from '@/components/panel/LoginRequired';

export default function GalaxyMy() {
  // 로그인 여부 체크
  const { data: session, status } = useGetSession();
  if (session === null) return <LoginRequired />;
  if (status === 'error') return <div>로그인 세션 조회 실패</div>;

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
