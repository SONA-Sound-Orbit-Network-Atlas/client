import { FiArrowLeft } from 'react-icons/fi';

interface PanelHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function PanelHeader({
  title,
  onBack,
  showBackButton = true,
}: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-border p-[16px]">
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <button
            onClick={onBack}
            className=" text-text-muted hover:text-primary-300 transition-colors hover:cursor-pointer"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9"></div>
        )}
        <h2 className="text-white font-semibold text-lg">{title}</h2>
        <div className="w-9"></div>
      </div>
    </div>
  );
}
