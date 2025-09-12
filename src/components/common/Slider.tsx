import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { mergeClassNames } from '@/utils/mergeClassNames';

interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  showMinMax?: boolean;
  label?: string;
  showCurrentValue?: boolean;
  rangeColor?: string;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  showMinMax = true,
  label,
  showCurrentValue = true,
  rangeColor,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  const currentValue = Array.isArray(value) ? value[0] : value;

  return (
    <div className="w-full">
      {(label || showCurrentValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-text-muted">{label}</span>}
          {showCurrentValue && (
            <span className="text-sm font-semibold text-text-white">
              {currentValue}
            </span>
          )}
        </div>
      )}
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={mergeClassNames(
          'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={mergeClassNames(
            'bg-[#4D4D4D] border border-[#CCCCCC] relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-3 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={mergeClassNames(
              rangeColor ?? 'bg-tertiary-200',
              'absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
            )}
            style={rangeColor ? { backgroundColor: rangeColor } : undefined}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="bg-tertiary-200 ring-ring/50 block size-5 shrink-0 rounded-full shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          />
        ))}
      </SliderPrimitive.Root>
      {showMinMax && (
        <div className="flex justify-between text-sm text-text-muted mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}

export { Slider };
