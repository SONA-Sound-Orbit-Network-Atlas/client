import Button from '@/components/common/Button';
import { GoPlus } from 'react-icons/go';
import { useStellarTabStore } from '@/stores/useStellarTabStore';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';

export default function AddNewObjectBtn() {
  const { setTabValue } = useStellarTabStore();
  const { addNewObjectAndReturnId } = useStellarStore();
  const { setSelectedObjectId } = useSelectedObjectStore();

  return (
    <Button
      color="tertiary"
      className="w-full mt-6 text-text-muted"
      onClick={() => {
        setSelectedObjectId(addNewObjectAndReturnId());
        setTabValue('PROPERTIES');
      }}
    >
      <GoPlus style={{ width: '14px', height: '14px' }} /> ADD NEW OBJECT
    </Button>
  );
}
