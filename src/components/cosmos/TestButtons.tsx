import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import Button from '../common/Button';

export default function TestButtons() {
  const { setIdle } = useSelectedStellarStore();
  return (
    <Button
      onClick={() => {
        setIdle();
      }}
    >
      TestButtons
    </Button>
  );
}
