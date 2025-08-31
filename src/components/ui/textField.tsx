type TextFieldProps = {
  label: string;
  children: React.ReactNode;
  htmlFor: string;
};

export default function TextField({
  label,
  children,
  htmlFor,
}: TextFieldProps) {
  return (
    <div>
      <label
        className="block mb-2 text-[var(--color-text-muted)]"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
