import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { mergeClassNames } from '@/utils/mergeClassNames';

type RootProps = React.ComponentProps<typeof SliderPrimitive.Root>;

interface SliderInputProps
  extends Omit<
    RootProps,
    'value' | 'defaultValue' | 'min' | 'max' | 'orientation'
  > {
  min?: number;
  max?: number;
  rangeColor?: string;
  value?: number;
  defaultValue?: number;
}

/**
 * Slider: 게이지만 보이는 단일 값 슬라이더
 * - min/max를 받지만 화면에는 숫자를 렌더링하지 않음
 * - 라벨/현재값 UI 없음
 */
export function SliderInput({
  className,
  min = 0,
  max = 100,
  rangeColor,
  value,
  defaultValue,
  ...props
}: SliderInputProps) {
  // Radix Slider는 배열을 받으므로 단일 값을 배열로 감싸서 전달
  const controlled = typeof value === 'number';
  const valArray = controlled ? [value!] : undefined;
  const defaultValArray =
    !controlled && typeof defaultValue === 'number'
      ? [defaultValue]
      : undefined;

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      min={min}
      max={max}
      value={valArray}
      defaultValue={defaultValArray}
      className={mergeClassNames(
        'relative flex w-full touch-none select-none items-center',
        'data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={mergeClassNames(
          // 트랙(회색 바)
          'relative grow overflow-hidden rounded-full',
          'data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full',
          'bg-[#4D4D4D]'
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={mergeClassNames(
            rangeColor ?? 'bg-primary-300',
            'absolute data-[orientation=horizontal]:h-full'
          )}
          style={rangeColor ? { backgroundColor: rangeColor } : undefined}
        />
      </SliderPrimitive.Track>

      {/* 단일 Thumb */}
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        className={mergeClassNames(
          'block size-4 shrink-0 rounded-full cursor-pointer',
          'bg-tertiary-200 shadow-sm ring-ring/50',
          'transition-[color,box-shadow] hover:ring-2 focus-visible:ring-2 focus-visible:outline-hidden',
          'disabled:pointer-events-none disabled:opacity-50'
        )}
        aria-label="Value"
      />
    </SliderPrimitive.Root>
  );
}
