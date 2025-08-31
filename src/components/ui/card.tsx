export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-w-[223px] bg-[var(--color-navy-opacity-60)] rounded-[8px] p-[17px] border-solid border-[1px] border-[var(--color-border-white)] text-[var(--color-text-secondary)] text-[14px]">
      {children}
    </div>
  );
}
