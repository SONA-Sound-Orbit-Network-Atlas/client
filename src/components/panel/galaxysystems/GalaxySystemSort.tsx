import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu';
import Button from '@/components/common/Button';
import { IoMdArrowDropdown } from 'react-icons/io';
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/common/DropdownMenu';
import { useState } from 'react';
import { type SortLabel } from '@/types/galaxy';
import PanelTitle from '../PanelTitle';

interface GalaxySystemSortProps {
  sortOptions: SortLabel[];
  setSort: (sort: SortLabel) => void;
  sort: SortLabel;
}

export default function GalaxySystemSort({
  sortOptions,
  setSort,
  sort,
}: GalaxySystemSortProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-6">
      <PanelTitle>SORT BY</PanelTitle>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button color="tertiary" className="w-56" textAlign="left">
            {sort}
            <IoMdArrowDropdown
              className={`ml-auto transition-transform duration-200 ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuRadioGroup
            value={sort}
            onValueChange={(value) => setSort(value as SortLabel)}
          >
            {sortOptions.map((option) => (
              <DropdownMenuRadioItem key={option} value={option}>
                {option}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
