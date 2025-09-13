import { cva, type VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '@/utils/mergeClassNames';

const panelTitleVariants = cva('block mb-3 text-text-muted', {
  variants: {
    fontSize: {
      small: 'text-[12px] font-semibold',
      large: 'text-[16px] font-bold',
    },
  },
  defaultVariants: {
    fontSize: 'small',
  },
});

interface PanelTitleProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof panelTitleVariants> {
  textColor?: string;
  className?: string;
  children: React.ReactNode;
}

export default function PanelTitle({
  children,
  fontSize,
  textColor,
  className,
  ...props
}: PanelTitleProps) {
  return (
    <strong
      {...props}
      className={mergeClassNames(
        panelTitleVariants({ fontSize }),
        textColor,
        className
      )}
    >
      {children}
    </strong>
  );
}
