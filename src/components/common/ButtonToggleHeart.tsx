import Button from '@/components/common/Button';
import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface ButtonToggleHeartProps {
  className?: string;
  active: boolean | null;
  onClick?: () => void;
}

export default function ButtonToggleHeart({
  className,
  active,
  onClick,
}: ButtonToggleHeartProps) {
  const [isActive, setIsActive] = useState<boolean | null>(active);

  const onClickHandle = () => {
    if (active === null) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    setIsActive(!isActive);
    onClick?.();
  };

  return (
    <Button
      color="transparent"
      className={`w-[30px] h-[40px] ${className}`}
      onClick={onClickHandle}
    >
      {isActive ? <FaHeart /> : <FaRegHeart />}
    </Button>
  );
}
