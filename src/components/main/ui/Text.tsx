import type { ReactNode } from 'react';

type TitleTextProps = {
  children: ReactNode;
};

type BodyTextProps = {
  children: ReactNode;
};

export function TitleText({ children }: TitleTextProps) {
  return (
    <h1 className="text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] tracking-[-0.05em] text-white mb-8">
      {children}
    </h1>
  );
}

export function BodyText({ children }: BodyTextProps) {
  return (
    <p className="text-[clamp(1rem,2.5vw,1.5rem)] leading-relaxed text-gray-300 max-w-[600px]">
      {children}
    </p>
  );
}
