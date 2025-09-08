// GALAXY > My (내 항성계 리스트)

import List from './List';
import PanelTitle from '../../PanelTitle';
import CreateNewButton from './CreateNewButton';

export default function GalaxyMy() {
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
