import { useSceneStore } from '@/stores/useSceneStore';

export default function DebugMessage() {
  const {
    focusedPosition,
    viewMode,
    cameraIsMoving,
    cameraTarget,
    selectedStellarSystemId,
  } = useSceneStore();

  return (
    <div>
      <div>
        <p>View Mode: {viewMode}</p>
        <p>
          Target Position: {cameraTarget?.x}, {cameraTarget?.y},{' '}
          {cameraTarget?.z}
        </p>
        <p>
          Focused Position: {focusedPosition?.x}, {focusedPosition?.y},{' '}
          {focusedPosition?.z}
        </p>
        <p>Selected Stellar System ID: {selectedStellarSystemId}</p>
        <p>Camera Is Moving: {cameraIsMoving ? 'true' : 'false'}</p>
      </div>
    </div>
  );
}
