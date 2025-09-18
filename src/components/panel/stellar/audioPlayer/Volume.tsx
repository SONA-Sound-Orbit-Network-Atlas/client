import { IoIosVolumeMute } from 'react-icons/io';
import { IoIosVolumeHigh } from 'react-icons/io';
import { SliderInput } from '@/components/common/SliderInput';
import { useEffect, useState, useCallback } from 'react';
import { mergeClassNames } from '@/utils/mergeClassNames';
import Button from '@/components/common/Button';
import { AudioEngine } from '@/audio/core/AudioEngine';

interface VolumeProps {
  className?: string;
  onVolumeChange?: (volume: number) => void;
}

export default function Volume({ className, onVolumeChange }: VolumeProps) {
  const audioEngine = AudioEngine.instance;
  const [volume, setVolume] = useState(() => audioEngine.getMasterVolume());

  useEffect(() => {
    return audioEngine.onVolumeChange((next) => {
      setVolume(next);
      onVolumeChange?.(next);
    });
  }, [audioEngine, onVolumeChange]);

  const applyVolume = useCallback((next: number) => {
    audioEngine.setMasterVolume(next);
  }, [audioEngine]);

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
        onClick={() => applyVolume(0)}
      >
        <IoIosVolumeMute />
      </Button>

      <SliderInput
        min={0}
        max={100}
        value={volume}
        onValueChange={(vals) => applyVolume(vals[0])}
        className="flex-1 h-[8px]"
      />

      <Button
        iconOnly
        size="xxs"
        color="transparent"
        onClick={() => applyVolume(100)}
      >
        <IoIosVolumeHigh />
      </Button>
    </div>
  );
}
