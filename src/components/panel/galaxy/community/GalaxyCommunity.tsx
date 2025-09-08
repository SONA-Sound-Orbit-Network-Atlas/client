// GALAXY > COMMUNITY (다른 사람 항성계 리스트)

import { useState } from 'react';
import { sortOptions } from '@/types/galaxyCommunity';
import type { SortLabel } from '@/types/galaxyCommunity';
import Sort from './Sort';
import List from './List';
import PanelTitle from '../../PanelTitle';

export default function GalaxyCommunity() {
  const [sort, setSort] = useState<SortLabel>(sortOptions[0].label);

  return (
    <div>
      <Sort
        sortOptions={sortOptions.map((option) => option.label)}
        setSort={setSort}
        sort={sort}
      />
      <section className="mb-6">
        <PanelTitle>GALAXY LIST</PanelTitle>
        <List sort={sort} />
      </section>
    </div>
  );
}
