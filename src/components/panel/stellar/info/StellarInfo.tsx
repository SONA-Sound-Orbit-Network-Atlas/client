import PanelTitle from '../../PanelTitle';
import Card from '@/components/common/Card/Card';
import TextInput from '@/components/common/TextInput';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useStellarStore } from '@/stores/useStellarStore';
import CloneStellarButton from './CloneStellarButton';
import DeleteStellarButton from './DeleteStellarButton';
import { useUserStore } from '@/stores/useUserStore';
import { formatDateToYMD } from '@/utils/formatDateToYMD';

export default function StellarInfo({
  isStellarOwner,
}: {
  isStellarOwner: boolean;
}) {
  const { stellarStore, setStellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();
  const { mode } = useSelectedStellarStore();
  const { isLoggedIn } = useUserStore();

  // 1) 현재 선택이 스타인지 판별: 하드코딩 'star_001' 대신 실제 id 사용
  const starId = stellarStore.star?.id; // ''일 수 있음
  const isStarSelected = selectedObjectId === starId;

  // 2) 행성 정보 조회
  const planetInfo = stellarStore.planets.find(
    (p) => p.id === selectedObjectId
  );

  // 3) 스타 정보 (표시용)
  const starInfo = {
    STELLAR_TITLE: stellarStore.title,
    STAR_NAME: stellarStore.star.name,
    CREATOR: stellarStore.creator_name,
    AUTHOR: stellarStore.author_name,
    ['CREATE SOURCE']: stellarStore.title,
    ['ORIGINAL SOURCE']: stellarStore.title,
  };

  // 4) 최종 표시 대상: 선택이 스타이거나, 매칭되는 플래닛이 없으면 스타로 fallback
  const stellarInfo = isStarSelected || !planetInfo ? starInfo : planetInfo;
  if (!stellarInfo) return null;

  const stellarInfoArr = Object.entries(stellarInfo);

  return (
    <div className="w-full">
      {/* 타이틀 */}
      <PanelTitle fontSize="large" textColor="text-primary-300">
        {isStarSelected ? 'STAR INFO' : 'PLANET INFO'}
      </PanelTitle>

      {/* INFO 카드 */}
      <Card className="space-y-4 w-full">
        {stellarInfoArr.map(([rawKey, value]) => {
          const key = rawKey.toLowerCase(); // ← 소문자로 통일

          switch (key) {
            case 'id':
            case 'system_id':
            case 'properties':
            case 'object_type':
            case 'synthtype':
            case 'oscillatortype':
              return null;

            case 'stellar_title':
              return (
                <div key={rawKey}>
                  <PanelTitle className="font-normal mb-1">
                    STELLAR TITLE
                  </PanelTitle>
                  {isStellarOwner || mode === 'create' ? (
                    // 스텔라 Title
                    <TextInput
                      className="text-sm"
                      value={String(value)}
                      onChange={(e) => {
                        const nextTitle = e.target.value;
                        setStellarStore({
                          ...stellarStore,
                          title: nextTitle,
                        });
                      }}
                    />
                  ) : (
                    <p className="text-text-secondary">{String(value)}</p>
                  )}
                </div>
              );
            case 'star_name':
              return (
                <div key={rawKey}>
                  <PanelTitle className="font-normal mb-1">
                    STAR NAME
                  </PanelTitle>
                  {isStellarOwner || mode === 'create' ? (
                    // STAR Name
                    <TextInput
                      className="text-sm"
                      value={String(value)}
                      onChange={(e) => {
                        const nextName = e.target.value;
                        setStellarStore({
                          ...stellarStore,
                          star: { ...stellarStore.star, name: nextName },
                        });
                      }}
                    />
                  ) : (
                    <p className="text-text-secondary">{String(value)}</p>
                  )}
                </div>
              );
            case 'name':
              return (
                <div key={rawKey}>
                  <PanelTitle className="font-normal mb-1">NAME</PanelTitle>
                  {isStellarOwner || mode === 'create' ? (
                    // PLANET Name
                    <TextInput
                      className="text-sm"
                      value={String(value)}
                      onChange={(e) => {
                        const nextName = e.target.value;
                        setStellarStore({
                          ...stellarStore,
                          planets: stellarStore.planets.map((planet) =>
                            planet.id === selectedObjectId
                              ? { ...planet, name: nextName }
                              : planet
                          ),
                        });
                      }}
                    />
                  ) : (
                    <p className="text-text-secondary">{String(value)}</p>
                  )}
                </div>
              );
            case 'updated_at':
            case 'created_at':
              return (
                <div key={rawKey}>
                  <PanelTitle className="font-normal mb-1">
                    {rawKey.toUpperCase().replace('_', ' ')}
                  </PanelTitle>
                  <p className="text-text-secondary">
                    {formatDateToYMD(String(value))}
                  </p>
                </div>
              );

            default:
              return (
                <div key={rawKey} className="w-full">
                  <PanelTitle className="font-normal mb-1">
                    {rawKey.toUpperCase().replace('_', ' ')}
                  </PanelTitle>
                  <p className="text-text-secondary max-w-[187px] truncate">
                    {String(value)}
                  </p>
                </div>
              );
          }
        })}
      </Card>

      {/* CLONE 버튼 */}
      {mode !== 'create' && !isStellarOwner && isLoggedIn && (
        <CloneStellarButton />
      )}

      {/* DELETE 버튼 */}
      {mode === 'view' && isStellarOwner && <DeleteStellarButton />}
    </div>
  );
}
