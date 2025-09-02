interface PanelTitleProps {
  children: React.ReactNode;
  textColor?: string;
}

export default function PanelTitle({
  children,
  textColor = 'text-text-muted',
}: PanelTitleProps) {
  return <strong className={`${textColor} block mb-3`}>{children}</strong>;
}
