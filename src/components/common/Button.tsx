import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '@/utils/mergeClassNames';

const buttonVariants = cva(
  "py-0 m-0 border border-[1px] rounded-[8px] cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive leading-none box-border",
  {
    variants: {
      color: {
        primary:
          'bg-gradient-to-r from-secondary-300 to-primary-300 text-text-white border-secondary-300/20 hover:brightness-110 hover:border-secondary-300/50',
        secondary:
          'bg-tertiary-200/10 text-tertiary-200 border-tertiary-200/20 hover:brightness-110 hover:bg-tertiary-200/20 hover:border-tertiary-200/30',
        tertiary:
          'text-text-white border-gray-border bg-gray-card hover:brightness-110 hover:bg-gray-border hover:border-primary-300/20',
        transparent: 'text-text-muted border-none bg-transparent',
      },
      size: {
        lg: 'h-[46px] px-5 font-semibold',
        md: 'h-[40px] px-4',
        sm: 'h-[38px] px-3',
        xs: 'h-[30px] px-2',
        xxs: 'h-[16px] px-0',
      },
      textAlign: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
      },
      iconOnly: {
        true: 'gap-0',
      },
      // ✅ 새로 추가: 클릭(선택) 상태
      clicked: {
        true: '', // 기본은 빈 값, 조합별로 compoundVariants에서 스타일 지정
        false: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
      },
    },
    compoundVariants: [
      // 아이콘 전용 크기
      { iconOnly: true, size: 'lg', class: 'w-[46px] px-0' },
      { iconOnly: true, size: 'md', class: 'w-[40px] px-0' },
      { iconOnly: true, size: 'sm', class: 'w-[38px] px-0' },
      { iconOnly: true, size: 'xs', class: 'w-[30px] px-0' },
      { iconOnly: true, size: 'xxs', class: 'w-[16px] px-0' },

      // ✅ 요구사항: color=tertiary + clicked → primary 스타일로 스왑
      {
        color: 'tertiary',
        clicked: true,
        class:
          'bg-gradient-to-r from-secondary-300 to-primary-300 text-text-white border-secondary-300-20',
      },
    ],
    defaultVariants: {
      color: 'primary',
      size: 'lg',
      textAlign: 'center',
      clicked: false,
    },
  }
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    textAlign?: 'left' | 'center' | 'right';
    iconOnly?: boolean;
    clicked?: boolean; // ✅ 추가
    asChild?: boolean;
  };

function Button({
  className,
  color,
  size,
  textAlign,
  iconOnly = false,
  clicked = false, // ✅ 추가
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={mergeClassNames(
        buttonVariants({ color, size, iconOnly, textAlign, clicked, className })
      )}
      {...props}
    />
  );
}

export default Button;
