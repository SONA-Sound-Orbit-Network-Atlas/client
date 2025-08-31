export default function Card({
  children,
  role = 'region',
  ...props
}: {
  children: React.ReactNode;
  role?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="w-full min-w-[223px] bg-[var(--color-navy-opacity-60)] rounded-[8px] p-[17px] border-solid border-[1px] border-[var(--color-border-white)] text-[var(--color-text-secondary)] text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      role={role}
      {...props}
    >
      {children}
    </div>
  );
}
