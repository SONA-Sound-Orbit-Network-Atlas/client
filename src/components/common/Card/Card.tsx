import { mergeClassNames } from '@/utils/mergeClassNames';

interface CardProps {
  children: React.ReactNode;
  role?: string;
  className?: string;
  clicked?: boolean;
}

export default function Card({
  children,
  role = 'region',
  className,
  clicked = false,
  ...props
}: CardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={mergeClassNames(
        `w-full bg-gray-card rounded-[8px] p-[17px] border-solid 
        border-[1px] border-gray-border text-text-secondary text-[14px]
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50`,
        role === 'button'
          ? 'hover:brightness-110 hover:bg-text-white/20 hover:text-white hover:[&_p]:text-white hover:[&_svg]:text-white'
          : '',
        className,
        clicked ? 'border-secondary-300' : ''
      )}
      role={role}
      {...props}
    >
      {children}
    </div>
  );
}
