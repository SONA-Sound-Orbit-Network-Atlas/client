import { useStellarSystem } from '@/hooks/useStellarSystem';
import Button from '../common/Button';
import * as THREE from 'three';

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
