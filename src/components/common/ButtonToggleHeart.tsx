import Button from '@/components/common/Button';
import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface ButtonToggleHeartProps {
  className?: string;
  active: boolean;
  onClick?: () => void;
}

export default function ButtonToggleHeart({
  className,
  active,
  onClick,
}: ButtonToggleHeartProps) {
  const [isActive, setIsActive] = useState(active);

  const onClickHandle = () => {
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
