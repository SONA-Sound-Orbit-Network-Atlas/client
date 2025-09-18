import Button from '@/components/common/Button';
import { FiSave } from 'react-icons/fi';
import { useCreateStellar, useUpdateStellar } from '@/hooks/api/useStellar';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useStellarStore } from '@/stores/useStellarStore';
import { useUserStore } from '@/stores/useUserStore';
import { useSidebarStore } from '@/stores/useSidebarStore';

export default function SaveButton() {
  const { mutate: createStellar, isPending: isCreatePending } =
    useCreateStellar();
  const { mutate: updateStellar, isPending: isUpdatePending } =
    useUpdateStellar();
  const { mode, setIdle } = useSelectedStellarStore();
  const { stellarStore, setInitialStellarStore } = useStellarStore();
  const { userStore, isLoggedIn } = useUserStore();
  const { openSecondarySidebar } = useSidebarStore();

  // save 버튼 동작 기준
  const onSaveHandler = () => {
    console.log('save버튼 클릭');
    console.log('stellarStore', stellarStore);

    if (!isLoggedIn) {
      alert('login is required.');
      return;
    }
    // 1. (생성) create 모드
    // 완료 시 => selectedStellarStore 초기화 & stellarStore 초기화 & 갤럭시 패널 이동
    if (mode === 'create') {
      console.log('create모드 => save버튼 클릭 => 생성');
      createStellar(stellarStore, {
        onSuccess: () => {
          setIdle();
          setInitialStellarStore();
          openSecondarySidebar('galaxy');
        },
        onError: () => {
          alert('CREATE failed');
        },
      });
    }
    // 2. (수정) view 모드, 선택된 stellar 스토어의 userId와 현재 로그인한 userId가 같을 때
    if (mode === 'view' && stellarStore.creator_id === userStore.id) {
      console.log('view모드 & 작성자 일치 => save버튼 클릭 => 수정');
      updateStellar(
        { stellarId: stellarStore.id, stellarData: stellarStore },
        {
          onSuccess: () => {
            openSecondarySidebar('galaxy');
          },
          onError: () => {
            alert('UPDATE failed');
          },
        }
      );
    }
  };

  return (
    <Button
      color="tertiary"
      size="sm"
      onClick={onSaveHandler}
      disabled={isCreatePending || isUpdatePending}
    >
      <FiSave className="w-4 h-4" />
      {isCreatePending
        ? 'CREATING...'
        : isUpdatePending
          ? 'UPDATING...'
          : 'SAVE'}
    </Button>
  );
}
