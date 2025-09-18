import Button from '@/components/common/Button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { mergeClassNames } from '@/utils/mergeClassNames';
import { FaHeartCirclePlus } from 'react-icons/fa6';
import { FaHeartCrack } from 'react-icons/fa6';
import { useUserStore } from '@/stores/useUserStore';

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
  const { isLoggedIn } = useUserStore();

  const onClickHandle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  // 로그인하지 않았을 때는 버튼을 렌더링하지 않음
  if (!isLoggedIn) {
    return null;
  }

  return (
    <Button
      color="transparent"
      className={mergeClassNames(
        'group relative grid place-items-center w-[30px] h-[40px] hover:cursor-pointer',
        className
      )}
      onClick={onClickHandle}
    >
      {/* 기본 아이콘: 상태별로 다름 */}
      {active ? (
        <FaHeart className="w-5 h-5 transition-opacity duration-150 opacity-100 group-hover:opacity-0" />
      ) : (
        <FaRegHeart className="w-5 h-5 transition-opacity duration-150 opacity-100 group-hover:opacity-0" />
      )}

      {/* 호버 아이콘: 상태별로 다름 (오버레이) */}
      <span className="pointer-events-none absolute inset-0 grid place-items-center">
        {active ? (
          <FaHeartCrack className="w-5 h-5 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
        ) : (
          <FaHeartCirclePlus className="w-5 h-5 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
        )}
      </span>
    </Button>
  );
}
