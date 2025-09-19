import Button from '@/components/common/Button';
import { useDeleteStellar } from '@/hooks/api/useStellar';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useStellarStore } from '@/stores/useStellarStore';
import { useStellarTabStore } from '@/stores/useStellarTabStore';
import { useState } from 'react';

export default function DeleteStellarButton() {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { mutate: deleteStellar, isPending } = useDeleteStellar();
  const { selectedStellarId } = useSelectedStellarStore();
  const { openSecondarySidebar } = useSidebarStore();
  const { setInitialStellarStore } = useStellarStore();
  const { setIdle } = useSelectedStellarStore();
  const { setSelectedObjectId } = useSelectedObjectStore();
  const { setTabValue } = useStellarTabStore();

  const onDeleteHandler = () => {
    deleteStellar(selectedStellarId, {
      onSuccess: () => {
        setDeleteConfirm(false);
        openSecondarySidebar('galaxy');
        setInitialStellarStore();
        setIdle();
        setSelectedObjectId('');
        setTabValue('INFO');
      },
      onError: () => {
        alert('DELETE failed');
      },
    });
  };
  return (
    <div className="w-full mt-3">
      {deleteConfirm ? (
        <div className="flex justify-center gap-2">
          <Button
            size="lg"
            color="transparent"
            onClick={onDeleteHandler}
            className="text-xs hover:text-error/80"
          >
            DELETE
          </Button>
          <Button
            size="lg"
            color="transparent"
            onClick={() => setDeleteConfirm(false)}
            className="text-xs hover:text-white"
          >
            CANCEL
          </Button>
        </div>
      ) : (
        <Button
          color="transparent"
          className="w-full text-text-muted text-xs hover:text-error/80"
          disabled={isPending}
          onClick={() => {
            setDeleteConfirm(true);
          }}
        >
          DEACTIVATE STELLAR
        </Button>
      )}
    </div>
  );
}
