import { useSceneStore } from "@/stores/useSceneStore";

export default function DebugMessage() {
    const { focusedPosition,viewMode,cameraIsMoving,cameraTarget } = useSceneStore();
    

    

    return (
        <div>
            <div>
                <p>View Mode: {viewMode}</p>
                <p>Target Position: {cameraTarget?.x}, {cameraTarget?.y}, {cameraTarget?.z}</p>
                <p>Focused Position: {focusedPosition?.x}, {focusedPosition?.y}, {focusedPosition?.z}</p>
                <p>Camera Is Moving: {cameraIsMoving ? 'true' : 'false'}</p>
            </div>
        </div>
    );
}