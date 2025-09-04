import { mergeClassNames } from '@/utils/mergeClassNames';

interface PanelTitleProps {
  children: React.ReactNode;
  textColor?: string;
  fontSize?: string;
  className?: string;
}

export default function PanelTitle({
  children,
  textColor = 'text-text-muted',
  fontSize = 'text-lg',
  className,
}: PanelTitleProps) {
  return (
    <strong
      className={mergeClassNames('block mb-3', textColor, fontSize, className)}
    >
      {children}
    </strong>
  );
}
