import { mergeClassNames } from '@/utils/mergeClassNames';
import Play from './Play';
import Volume from './Volume';

interface AudioPlayerProps {
  className?: string;
}

export default function AudioPlayer({ className }: AudioPlayerProps) {
  return (
    <div
      className={mergeClassNames(
        'p-[10px] flex items-center gap-[10px]',
        className
      )}
    >
      {/* 재생버튼 */}
      <Play
        className="w-[32px] h-[32px] rounded-full flex-shrink-0"
        onClick={(isPlaying) => {
          console.log('play', isPlaying);
        }}
      />
      {/* 볼륨게이지 */}
      <Volume
        className="flex-1"
        onVolumeChange={(volume) => {
          console.log('volume', volume);
        }}
      />
    </div>
  );
}
