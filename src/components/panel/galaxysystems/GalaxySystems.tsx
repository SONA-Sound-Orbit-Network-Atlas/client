/* 
  GALAXY -> SYSTEMS 다른 사람 항성계 리스트
  컴포넌트 작성 순서
  1. 피그마 그대로 한 컴포넌트에 모두 작성
  2. 컴포넌트 및 파일 구조 분리
  3. API 연동 (axios, query)
*/

import {
  DropdownMenu,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu';
import PanelTitle from '@/components/panel/PanelTitle';
import Button from '@/components/common/Button';
import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import GalaxySystemCard from './GalaxySystemCard';
import { dummyGalaxySystems } from './dummy_galaxys';

type postionType = 'Top Today' | 'Top All Time' | 'Recent';

const sectionStyle = 'mb-6';

export default function GalaxySystems() {
  const [position, setPosition] = useState<postionType>('Top Today');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <section className={sectionStyle}>
        <PanelTitle>SORT BY</PanelTitle>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button color="tertiary" className="w-56" textAlign="left">
              {position}
              <IoMdArrowDropdown
                className={`ml-auto transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="Top Today">
                Top Today
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Top All Time">
                Top All Time
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Recent">
                Recent
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
      <section className={sectionStyle}>
        <PanelTitle>TOP SYSTEMS TODAY</PanelTitle>
        <div className="space-y-3">
          {dummyGalaxySystems.map((galaxySystem) => (
            <GalaxySystemCard key={galaxySystem.rank} {...galaxySystem} />
          ))}
        </div>
      </section>
    </div>
  );
}
