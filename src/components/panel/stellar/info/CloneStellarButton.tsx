import Button from '@/components/common/Button';
import { useCloneStellar } from '@/hooks/api/useStellar';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';

export default function CloneStellarButton() {
  const { selectedStellarId } = useSelectedStellarStore();
  const { mutate: cloneStellar, isPending } = useCloneStellar();
  const { openSecondarySidebar } = useSidebarStore();

  // CLONE 버튼 클릭 시
  // 1. 현재 stellarStore 로 스텔라 CLONE API 호출
  // 2. 갤럭시 패널 - MY 탭으로 이동

  return (
    <Button
      color="secondary"
      className="w-full mt-6"
      disabled={isPending}
      onClick={() => {
        cloneStellar(selectedStellarId, {
          onSuccess: () => {
            openSecondarySidebar('galaxy');
          },
          onError: () => {
            alert('CLONE failed');
          },
        });
      }}
    >
      + CREATE NEW CLONE
    </Button>
  );
}
