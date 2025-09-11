import Button from '@/components/common/Button';
import { GoPlus } from 'react-icons/go';
import { useStellarTabStore } from '@/stores/useStellarTabStore';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';

export default function AddNewObjectBtn() {
  const { setTabValue } = useStellarTabStore();
  const { addNewObjectAndReturnId } = useStellarStore();
  const { setSelectedObjectId } = useSelectedObjectStore();

  const addNewObjectHandler = () => {
    const newId = addNewObjectAndReturnId(); // 1) 생성 + "실제" id 확보
    setSelectedObjectId(newId); // 2) 선택 대상 설정
    setTabValue('PROPERTIES'); // 3) 탭 전환
  };

  return (
    <Button
      color="tertiary"
      className="w-full mt-6 text-text-muted"
      onClick={addNewObjectHandler}
    >
      <GoPlus style={{ width: '14px', height: '14px' }} /> ADD NEW OBJECT
    </Button>
  );
}
