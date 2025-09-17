import Button from '@/components/common/Button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface ButtonLikeProps {
  className?: string;
  active: boolean | null;
  onClick?: () => void;
}

export default function ButtonLike({
  className,
  active,
  onClick,
}: ButtonLikeProps) {
  const onClickHandle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <Button
      color="transparent"
      className={`w-[30px] h-[40px] ${className}`}
      onClick={onClickHandle}
    >
      {active ? <FaHeart /> : <FaRegHeart />}
    </Button>
  );
}
