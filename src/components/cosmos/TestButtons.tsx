import { useStellarSystem } from '@/hooks/useStellarSystem';
import Button from '../common/Button';

export default function TestButtons() {
  const { changeToGalaxyView } = useStellarSystem();
  return (
    <Button
      onClick={() => {
        changeToGalaxyView();
      }}
    >
      TestButtons
    </Button>
  );
}
