import { mergeClassNames } from '@/utils/mergeClassNames';
import { sectionStyles } from './constants';

interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isSelected: boolean;
  onClick: (id: string) => void;
  section: 'top' | 'bottom';
}

export default function SidebarItem({
  id,
  label,
  icon: Icon,
  isSelected,
  onClick,
  section,
}: SidebarItemProps) {
  const styles = sectionStyles[section];

  return (
    <div
      className={mergeClassNames(
        'w-12 h-12 rounded-lg cursor-pointer transition-all duration-200',
        'flex items-center justify-center',
        isSelected
          ? styles.selectedStyle
          : `bg-transparent ${styles.iconColor} ${styles.hoverEffect}`
      )}
      onClick={() => onClick(id)}
      title={label} // 툴팁으로 라벨 표시
    >
      <Icon className={styles.iconSize} />
    </div>
  );
}
