import { useSceneStore } from "@/stores/useSceneStore";

export default function DebugMessage() {
    const { focusedPosition,viewMode } = useSceneStore();

    

    return (
        <div>
            <div>
                <p>View Mode: {viewMode}</p>
                <p>Focused Position: {focusedPosition?.x}, {focusedPosition?.y}, {focusedPosition?.z}</p>
            </div>
        </div>
    );
}