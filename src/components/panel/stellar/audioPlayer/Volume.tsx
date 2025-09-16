import { IoIosVolumeMute } from 'react-icons/io';
import { IoIosVolumeHigh } from 'react-icons/io';
import { SliderInput } from '@/components/common/SliderInput';
import { useEffect, useState } from 'react';
import { mergeClassNames } from '@/utils/mergeClassNames';
import Button from '@/components/common/Button';

interface VolumeProps {
  className?: string;
  onVolumeChange?: (volume: number) => void;
}

export default function Volume({ className, onVolumeChange }: VolumeProps) {
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    onVolumeChange?.(volume);
  }, [volume, onVolumeChange]);

  return (
    <div
      className={mergeClassNames(
        'flex items-center justify-between gap-[8px]',
        className
      )}
    >
      <Button
        iconOnly
        size="xxs"
        color="transparent"
        onClick={() => setVolume(0)}
      >
        <IoIosVolumeMute />
      </Button>

      <SliderInput
        min={0}
        max={100}
        value={volume}
        onValueChange={(vals) => setVolume(vals[0])}
        className="flex-1 h-[8px]"
      />

      <Button
        iconOnly
        size="xxs"
        color="transparent"
        onClick={() => setVolume(100)}
      >
        <IoIosVolumeHigh />
      </Button>
    </div>
  );
}
