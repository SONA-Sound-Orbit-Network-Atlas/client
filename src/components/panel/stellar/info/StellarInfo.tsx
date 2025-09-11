import PanelTitle from '../../PanelTitle';
import Card from '@/components/common/Card';
import TextInput from '@/components/common/TextInput';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useStellarStore } from '@/stores/useStellarStore';

export default function StellarInfo({
  isStellarOwner,
}: {
  isStellarOwner: boolean;
}) {
  const { stellarStore, setStellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();
  // 선택된 행성 정보 조회
  const stellarInfo = stellarStore.objects.find(
    (object) => object.planetId === selectedObjectId
  );
  if (!stellarInfo) return null;
  const stellarInfoArr = Object.entries(stellarInfo);

  return (
    <div>
      <PanelTitle fontSize="text-md" textColor="text-primary-300">
        행성 INFO
      </PanelTitle>

      <Card className="space-y-4">
        {stellarInfoArr.map(([key, value]) => {
          switch (key) {
            case 'properties':
              return null;
            case 'planetId':
              return null;
            case 'planetType':
              return null;
            case 'name':
              return (
                <div key={key}>
                  <PanelTitle fontSize="text-xs" className="font-normal mb-1">
                    NAME
                  </PanelTitle>
                  {isStellarOwner ? (
                    <TextInput
                      className="text-sm bg"
                      value={String(value)}
                      onChange={(e) => {
                        if (isStellarOwner) {
                          setStellarStore({
                            ...stellarStore,
                            objects: stellarStore.objects.map((object) =>
                              object.planetId === selectedObjectId
                                ? { ...object, name: e.target.value }
                                : object
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
            case 'status':
              return (
                <div key={key}>
                  <PanelTitle fontSize="text-xs" className="font-normal mb-1">
                    STATUS
                  </PanelTitle>
                  <p className="text-success">{String(value).toUpperCase()}</p>
                </div>
              );
            case 'soundType':
              return (
                <div key={key}>
                  <PanelTitle fontSize="text-xs" className="font-normal mb-1">
                    SOUND TYPE
                  </PanelTitle>
                  <p className="text-secondary-300">{String(value)}</p>
                </div>
              );
            default: // properties 제외한 나머지 케이스
              return (
                <div key={key}>
                  <PanelTitle fontSize="text-xs" className="font-normal mb-1">
                    {key.toUpperCase().replace('_', ' ')}
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
