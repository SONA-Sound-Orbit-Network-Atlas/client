import { mergeClassNames } from '@/utils/mergeClassNames';

function SkeletonCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeletonCard"
      className={mergeClassNames(
        'w-full min-w-[100px] bg-gray-card rounded-[8px] p-[17px] border-solid border-[1px] border-gray-border',
        'animate-pulse',
        'min-h-[60px]',
        className
      )}
      {...props}
    >
      {/* 스켈레톤 내용물 (옵셔널) */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export { SkeletonCard };
