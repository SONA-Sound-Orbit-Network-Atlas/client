import PanelTitle from '../../PanelTitle';
import Card from '@/components/common/Card';
import TextInput from '@/components/common/TextInput';
import { useGetStarInfo } from '@/hooks/api/useSystem';

export default function StarInfoComponent() {
  const { data } = useGetStarInfo(1);
  const starInfoArr: [string, string | number][] = Object.entries(data);

  return (
    <div>
      <PanelTitle fontSize="text-md" textColor="text-primary-300">
        STAR INFO
      </PanelTitle>

      <Card className="space-y-4">
        {starInfoArr.map(([key, value]) => {
          switch (key) {
            case 'name':
              return (
                <div key={key}>
                  <PanelTitle fontSize="text-xs" className="font-normal mb-1">
                    NAME
                  </PanelTitle>
                  <TextInput value={value} readOnly className="text-sm bg" />
                </div>
              );
            case 'status':
              return (
                <div key={key}>
                  <PanelTitle fontSize="text-xs" className="font-normal mb-1">
                    STATUS
                  </PanelTitle>
                  <p className="text-success">
                    {value.toString().toUpperCase()}
                  </p>
                </div>
              );
            default:
              return (
                <div key={key}>
                  <PanelTitle fontSize="text-xs" className="font-normal mb-1">
                    {key.toUpperCase().replace('_', ' ')}
                  </PanelTitle>
                  <p className="text-text-secondary">{value}</p>
                </div>
              );
          }
        })}
      </Card>
    </div>
  );
}
