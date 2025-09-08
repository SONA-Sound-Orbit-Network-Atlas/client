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
      className="w-full bg-gray-card rounded-[8px] p-[17px] border-solid border-[1px] border-gray-border text-text-secondary text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      role={role}
      {...props}
    >
      {children}
    </div>
  );
}
