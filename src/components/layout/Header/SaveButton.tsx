import Button from '@/components/common/Button';
import { FiSave } from 'react-icons/fi';
import { useCreateStellar, useUpdateStellar } from '@/hooks/api/useStellar';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useStellarStore } from '@/stores/useStellarStore';
import { useUserStore } from '@/stores/useUserStore';
import { useState } from 'react';

export default function SaveButton() {
  const [saveConfirm, setSaveConfirm] = useState(false);

  const { mutate: createStellar, isPending: isCreatePending } =
    useCreateStellar();
  const { mutate: updateStellar, isPending: isUpdatePending } =
    useUpdateStellar();
  const { mode } = useSelectedStellarStore();
  const { stellarStore } = useStellarStore();
  const { userStore, isLoggedIn } = useUserStore();

  // save 버튼 동작 기준
  const onSaveHandler = () => {
    console.log('save버튼 클릭');
    console.log('stellarStore', stellarStore);

    if (!isLoggedIn) {
      return alert('login is required.');
    }

    // stellarStore의 planets 배열 length가 0일 때 return
    if (stellarStore.planets.length === 0) {
      return alert('planets are required.');
    }

    // 1. (생성) create 모드
    // 완료 시 => selectedStellarStore 초기화 & stellarStore 초기화 & 갤럭시 패널 이동
    if (mode === 'create') {
      createStellar(stellarStore, {
        onSuccess: () => {
          setSaveConfirm(false);
        },
        onError: () => {
          alert('CREATE failed');
        },
      });
    }
    // 2. (수정) view 모드, 선택된 stellar 스토어의 userId와 현재 로그인한 userId가 같을 때
    if (mode === 'view' && stellarStore.creator_id === userStore.id) {
      updateStellar(
        { stellarId: stellarStore.id, stellarData: stellarStore },
        {
          onSuccess: () => {
            setSaveConfirm(false);
          },
          onError: () => {
            alert('UPDATE failed');
          },
        }
      );
    }
  };

  return (
    <div>
      {saveConfirm ? (
        <div className="flex gap-2">
          <Button size="sm" color="secondary" onClick={onSaveHandler}>
            Confirm
          </Button>
          <Button
            size="sm"
            color="tertiary"
            onClick={() => setSaveConfirm(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          color="tertiary"
          size="sm"
          onClick={() => setSaveConfirm(true)}
          disabled={isCreatePending || isUpdatePending}
        >
          <FiSave className="w-4 h-4" />
          {isCreatePending
            ? 'CREATING...'
            : isUpdatePending
              ? 'UPDATING...'
              : 'SAVE'}
        </Button>
      )}
    </div>
  );
}
