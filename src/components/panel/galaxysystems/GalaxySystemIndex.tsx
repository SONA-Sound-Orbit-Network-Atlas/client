/* 
  GALAXY -> SYSTEMS 다른 사람 항성계 리스트
  컴포넌트 작성 순서
  1. 피그마 그대로 한 컴포넌트에 모두 작성
  2. 컴포넌트 및 파일 구조 분리
  3. API 연동 (axios, query)
*/

import { useState } from 'react';
import { sortOptions } from '@/types/galaxy';
import type { SortLabel } from '@/types/galaxy';
import GalaxySystemSort from './GalaxySystemSort';
import GalaxySystemList from './GalaxySystemList';
import PanelTitle from '../PanelTitle';

export default function GalaxySystemIndex() {
  const [position, setPosition] = useState<SortLabel>(sortOptions[0].label);

  return (
    <div>
      <GalaxySystemSort
        sortOptions={sortOptions.map((option) => option.label)}
        setPosition={setPosition}
        position={position}
      />
      <section className="mb-6">
        <PanelTitle>GALAXY LIST</PanelTitle>
        <GalaxySystemList position={position} />
      </section>
    </div>
  );
}
