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
    if (active === null) {
      alert('로그인 후 이용해주세요.');
      return;
    }
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
