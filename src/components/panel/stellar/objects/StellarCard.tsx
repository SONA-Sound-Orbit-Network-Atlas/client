import Button from '@/components/common/Button';
import Card from '@/components/common/Card/Card';
import type { Star, Planet } from '@/types/stellar';
import { mergeClassNames } from '@/utils/mergeClassNames';
import { valueToColor } from '@/utils/valueToColor';
import { FaStar } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useUserStore } from '@/stores/useUserStore';

interface StellarCardProps {
  data: Star | Planet;
  onClick: () => void;
  active: boolean;
  className?: string;
  name: string;
}

export default function StellarCard({
  data,
  onClick,
  active,
  className,
  name,
}: StellarCardProps) {
  const { deletePlanet, stellarStore } = useStellarStore();
  const { setSelectedObjectId } = useSelectedObjectStore();
  const { userStore } = useUserStore();

  const isMyStellar = userStore.id === stellarStore.creator_id;

  const description =
    data.object_type === 'PLANET' ? 'PLANET • ' + data.role : 'CENTRAL STAR';

  return (
    <Card
      role="button"
      onClick={onClick}
      className={mergeClassNames(
        className,
        active ? 'border-secondary-300' : ''
      )}
    >
      <div
        className="grid justify-start items-center gap-3 w-full"
        style={{ gridTemplateColumns: '24px 1fr 24px' }}
      >
        {/* 색상 동그라미 */}
        <div
          className={`w-[24px] h-[24px] rounded-full border-[2px] border-[rgba(255,255,255,0.2)] shrink-0`}
          style={{
            backgroundColor: valueToColor(
              data.object_type === 'PLANET'
                ? (data.properties.planetColor ?? 0)
                : (data.properties.color ?? 0),
              0,
              360
            ),
          }}
        ></div>
        {/* 이름과 설명 */}
        <div className="min-w-0 overflow-hidden">
          <p
            className="w-full text-text-white line-clamp-2 break-words"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {name}
          </p>
          <p className="text-text-muted">{description}</p>
        </div>

        {/* STAR 경우 : 별자리 아이콘 / PLANET 경우 : 삭제 버튼 */}
        {data.object_type === 'STAR' ? (
          <div className="flex items-center justify-center w-[24px] h-[24px] shrink-0 text-[#FACC15] justify-self-end">
            <FaStar />
          </div>
        ) : (
          // 자신의 stellar인 경우 : 삭제 버튼 표시
          isMyStellar && (
            <Button
              color="transparent"
              iconOnly
              className="w-[24px] h-[24px] shrink-0 hover:[&_svg]:!text-error/80 hover:[&_svg]:!fill-error/80 justify-self-end"
              onClick={(e) => {
                e.stopPropagation();

                // stellarStore에서 해당 planet 삭제
                deletePlanet(data.id);
                // 현재 선택된 stellar의 star의 id로 대체
                setSelectedObjectId(stellarStore.star.id);
              }}
            >
              <RiDeleteBinLine className="w-full h-full" />
            </Button>
          )
        )}
      </div>
    </Card>
  );
}
