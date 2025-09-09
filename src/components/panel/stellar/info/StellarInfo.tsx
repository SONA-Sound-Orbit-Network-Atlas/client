import PanelTitle from '../../PanelTitle';
import Card from '@/components/common/Card';
import TextInput from '@/components/common/TextInput';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useStellarStore } from '@/stores/useStellarStore';

export default function StellarInfo() {
  const { stellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();

  const stellarInfo = stellarStore.objects.find(
    (object) => object.id === selectedObjectId
  );

  if (!stellarInfo) return null;

  const stellarInfoArr = Object.entries(stellarInfo);

  return (
    <div>
      <PanelTitle fontSize="text-md" textColor="text-primary-300">
        행성 INFO
      </PanelTitle>

      <Card className="space-y-4">
        {stellarInfoArr.map((object, index) => {
          switch (object[0]) {
            case 'id':
              return null;
            case 'properties':
              return null;
            case 'name':
              return (
                <div key={index}>
                  <PanelTitle fontSize="text-xs" className="font-normal mb-1">
                    NAME
                  </PanelTitle>
                  <TextInput
                    value={object[1]}
                    readOnly
                    className="text-sm bg"
                  />
                </div>
              );
            case 'status':
              return (
                <div key={index}>
                  <PanelTitle fontSize="text-xs" className="font-normal mb-1">
                    STATUS
                  </PanelTitle>
                  <p className="text-success">
                    {object[1].toString().toUpperCase()}
                  </p>
                </div>
              );
            default: // properties 제외한 나머지 케이스
              return (
                <div key={index}>
                  <PanelTitle fontSize="text-xs" className="font-normal mb-1">
                    {object[0].toUpperCase().replace('_', ' ')}
                  </PanelTitle>
                  <p className="text-text-secondary">{object[1]}</p>
                </div>
              );
          }
        })}
      </Card>
    </div>
  );
}
