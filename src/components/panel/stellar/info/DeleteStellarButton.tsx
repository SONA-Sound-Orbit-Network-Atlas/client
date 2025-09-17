import Button from '@/components/common/Button';
import { useDeleteStellar } from '@/hooks/api/useStellar';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useStellarStore } from '@/stores/useStellarStore';
import { useStellarTabStore } from '@/stores/useStellarTabStore';

export default function DeleteStellarButton() {
  const { mutate: deleteStellar, isPending } = useDeleteStellar();
  const { selectedObjectId } = useSelectedObjectStore();
  const { openSecondarySidebar } = useSidebarStore();
  const { setInitialStellarStore } = useStellarStore();
  const { setIdle } = useSelectedStellarStore();
  const { setSelectedObjectId } = useSelectedObjectStore();
  const { setTabValue } = useStellarTabStore();
  return (
    <Button
      color="transparent"
      className="w-full text-text-muted mt-3 text-xs"
      disabled={isPending}
      onClick={() => {
        const confirm = window.confirm('DEACTIVATE ACCOUNT');
        if (confirm) {
          deleteStellar(selectedObjectId, {
            onSuccess: () => {
              alert('DEACTIVATE ACCOUNT success');
              openSecondarySidebar('galaxy');
              setInitialStellarStore();
              setIdle();
              setSelectedObjectId('');
              setTabValue('INFO');
            },
            onError: () => {
              alert('DEACTIVATE ACCOUNT failed');
            },
          });
        }
      }}
    >
      DEACTIVATE ACCOUNT
    </Button>
  );
}
