import { FiAlertCircle, FiX } from 'react-icons/fi';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

export default function ErrorMessage({
  message,
  onClose,
  className = '',
}: ErrorMessageProps) {
  return (
    <div
      className={`bg-error/10 border border-error/20 rounded-lg p-3 mb-4 ${className}`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <FiAlertCircle className="h-5 w-5 text-error" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-error">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="text-error hover:text-error transition-colors"
              aria-label="에러 메시지 닫기"
            >
              <span className="sr-only">닫기</span>
              <FiX className="h-5 w-5 cursor-pointer" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
