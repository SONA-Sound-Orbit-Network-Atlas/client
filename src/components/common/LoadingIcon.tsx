import { mergeClassNames } from '@/utils/mergeClassNames';
import { TbLoaderQuarter } from 'react-icons/tb';

export default function LoadingIcon({ className }: { className?: string }) {
  return (
    <div
      className={mergeClassNames(
        'flex justify-center items-center mt-4 w-full',
        className
      )}
    >
      <TbLoaderQuarter className="animate-spin" size={20} />
    </div>
  );
}
