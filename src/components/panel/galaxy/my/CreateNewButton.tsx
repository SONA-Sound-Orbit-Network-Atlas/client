import Button from '@/components/common/Button';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useUserStore } from '@/stores/useUserStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useStellarTabStore } from '@/stores/useStellarTabStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';

export default function CreateNewButton() {
  const { setCreate } = useSelectedStellarStore();
  const { setInitialStellarStore } = useStellarStore();
  const { openSecondarySidebar } = useSidebarStore();
  const { userStore } = useUserStore();
  const { setTabValue } = useStellarTabStore();
  const { setSelectedObjectId } = useSelectedObjectStore();

  const handleCreateNewGalaxy = () => {
    // Stellar 스토어 초기화 -> 패널 모드 변경 -> 패널 화면 전환(Stellar 패널)
    setInitialStellarStore(userStore.username);
    setCreate();
    setSelectedObjectId('star_001');
    setTabValue('OBJECTS');
    openSecondarySidebar('stellar');
  };

  return (
    <Button
      color="secondary"
      className="w-full"
      onClick={handleCreateNewGalaxy}
    >
      + CREATE NEW GALAXY
    </Button>
  );
}
