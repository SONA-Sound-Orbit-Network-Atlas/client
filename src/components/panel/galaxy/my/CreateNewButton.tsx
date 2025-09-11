import Button from '@/components/common/Button';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useUserStore } from '@/stores/useUserStore';

export default function CreateNewButton() {
  const { setInitialStellarStore } = useStellarStore();
  const { openSecondarySidebar } = useSidebarStore();
  const { userStore } = useUserStore();

  const handleCreateNewGalaxy = () => {
    // 1. Stellar 스토어 초기화
    setInitialStellarStore(userStore.userName);
    // 2. 패널 화면 전환 -> Stellar 패널
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
