/* 
  GALAXY -> SYSTEMS 다른 사람 항성계 리스트
  컴포넌트 작성 순서
  1. 피그마 그대로 한 컴포넌트에 모두 작성
  2. 컴포넌트 및 파일 구조 분리
  3. API 연동 (axios, query)
*/

import { DropdownMenu } from '@/components/common/DropdownMenu';
import PanelTitle from '@/components/panel/PanelTitle';
import Card from '@/components/common/Card';

export default function GalaxySystems() {
  return (
    <div>
      <div>
        <PanelTitle>SORT BY</PanelTitle>
        <DropdownMenu />
      </div>
      <div>
        <PanelTitle>TOP SYSTEMS TODAY</PanelTitle>
        <Card>
          <div className="flex justify-between">
            <div>text</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
