/* 
  GALAXY - SYSTEMS 다른 사람 항성계 리스트
  컴포넌트 구조
  1. SORT
  2. 은하 리스트
*/

import { useState } from 'react';
import { sortOptions } from '@/types/galaxy';
import type { SortLabel } from '@/types/galaxy';
import GalaxySystemSort from './GalaxySystemSort';
import GalaxySystemList from './GalaxySystemList';
import PanelTitle from '../PanelTitle';

export default function GalaxySystemIndex() {
  const [sort, setSort] = useState<SortLabel>(sortOptions[0].label);

  return (
    <div>
      <GalaxySystemSort
        sortOptions={sortOptions.map((option) => option.label)}
        setSort={setSort}
        sort={sort}
      />
      <section className="mb-6">
        <PanelTitle>GALAXY LIST</PanelTitle>
        <GalaxySystemList sort={sort} />
      </section>
    </div>
  );
}
