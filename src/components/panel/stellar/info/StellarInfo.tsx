import PanelTitle from '../../PanelTitle';
import Card from '@/components/common/Card/Card';
import TextInput from '@/components/common/TextInput';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useStellarStore } from '@/stores/useStellarStore';

export default function StellarInfo({
  isStellarOwner,
}: {
  isStellarOwner: boolean;
}) {
  const { stellarStore, setStellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();
  const { mode } = useSelectedStellarStore();

  // 1) 현재 선택이 스타인지 판별: 하드코딩 'star_001' 대신 실제 id 사용
  const starId = stellarStore.star?.id; // ''일 수 있음
  const isStarSelected = selectedObjectId === starId;

  // 2) 행성 정보 조회
  const planetInfo = stellarStore.planets.find(
    (p) => p.id === selectedObjectId
  );

  // 3) 스타 정보 (표시용)
  const starInfo = {
    NAME: stellarStore.name,
    CREATOR: stellarStore.created_by_id,
    AUTHOR: stellarStore.original_author_id,
    ['CREATE SOURCE']: 'ORIGINAL COMPOSITION',
    ['ORIGINAL SOURCE']: 'SONA STUDIO',
  };

  // 4) 최종 표시 대상: 선택이 스타이거나, 매칭되는 플래닛이 없으면 스타로 fallback
  const stellarInfo = isStarSelected || !planetInfo ? starInfo : planetInfo;
  if (!stellarInfo) return null;

  const stellarInfoArr = Object.entries(stellarInfo);

  return (
    <div>
      <PanelTitle fontSize="large" textColor="text-primary-300">
        행성 INFO
      </PanelTitle>

      <Card className="space-y-4">
        {stellarInfoArr.map(([rawKey, value]) => {
          const key = rawKey.toLowerCase(); // ← 소문자로 통일

          switch (key) {
            case 'id':
            case 'system_id':
            case 'properties':
            case 'object_type':
              return null;

            case 'name':
              return (
                <div key={rawKey}>
                  <PanelTitle className="font-normal mb-1">NAME</PanelTitle>
                  {isStellarOwner || mode === 'create' ? (
                    <TextInput
                      className="text-sm"
                      value={String(value)}
                      onChange={(e) => {
                        const nextName = e.target.value;

                        if (isStarSelected || !planetInfo) {
                          setStellarStore({ ...stellarStore, name: nextName });
                        } else {
                          setStellarStore({
                            ...stellarStore,
                            planets: stellarStore.planets.map((planet) =>
                              planet.id === selectedObjectId
                                ? { ...planet, name: nextName }
                                : planet
                            ),
                          });
                        }
                      }}
                    />
                  ) : (
                    <p className="text-text-secondary">{String(value)}</p>
                  )}
                </div>
              );

            default:
              return (
                <div key={rawKey}>
                  <PanelTitle className="font-normal mb-1">
                    {rawKey.toUpperCase().replace('_', ' ')}
                  </PanelTitle>
                  <p className="text-text-secondary">{String(value)}</p>
                </div>
              );
          }
        })}
      </Card>
    </div>
  );
}
