import { useSceneStore } from '@/stores/useSceneStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useStellarStore } from '@/stores/useStellarStore';

export default function DebugMessage() {
  const { cameraIsMoving, cameraTarget, selectedStellarSystemId } =
    useSceneStore();
  const { mode } = useSelectedStellarStore();
  const { selectedStellarId } = useSelectedStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();
  const { stellarStore } = useStellarStore();

  return (
    <div>
      <div>
        <p>
          <strong>View Mode:</strong> {mode}
        </p>
        <p>
          <strong>Target Position:</strong> {cameraTarget?.x?.toFixed(2)},{' '}
          {cameraTarget?.y?.toFixed(2)}, {cameraTarget?.z?.toFixed(2)}
        </p>
        <p>
          <strong>Selected Stellar System ID:</strong> {selectedStellarSystemId}
        </p>
        <p>
          <strong>Selected Stellar ID:</strong> {selectedStellarId}
        </p>
        <p>
          <strong>Selected Object ID:</strong> {selectedObjectId}
        </p>
        <p>
          <strong>Camera Is Moving:</strong> {cameraIsMoving ? 'true' : 'false'}
        </p>
        <p>
          <strong>Stellar position:</strong>{' '}
          {JSON.stringify(stellarStore.position)}
        </p>
      </div>
    </div>
  );
}
