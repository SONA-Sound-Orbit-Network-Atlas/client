import PanelTitle from '../../PanelTitle';
import Card from '@/components/common/Card';
import TextInput from '@/components/common/TextInput';
import { useGetPlanetInfo } from '@/hooks/api/useSystem';

interface PlanetInfoComponentProps {
  planetNo: number;
}

export default function PlanetInfoComponent({
  planetNo,
}: PlanetInfoComponentProps) {
  const { data } = useGetPlanetInfo(1, planetNo);
  const planetInfoArr: [string, string | number][] = Object.entries(data);

  return (
    <div>
      <PanelTitle fontSize="text-md" textColor="text-primary-300">
        PLANET INFO
      </PanelTitle>

      <Card className="space-y-4">
        {planetInfoArr.map(([key, value]) => {
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
