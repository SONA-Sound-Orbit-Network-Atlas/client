import { FiUser } from 'react-icons/fi';
import Iconframe from '@/components/common/Iconframe';
import Button from '@/components/common/Button';
import { useSidebarStore } from '@/stores/useSidebarStore';

export default function LoginRequired() {
  const { openSecondarySidebar } = useSidebarStore();
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4">
        <Iconframe color="primary">
          <FiUser />
        </Iconframe>
        <div className="text-center">
          <strong className="text-white text-md font-semibold">
            LOGIN REQUIRED
          </strong>
          <p className="mt-2 text-text-muted text-sm">
            SIGN IN TO CREATE AND <br /> MANAGE SYSTEMS
          </p>
        </div>
      </div>

      <Button
        color="secondary"
        className="mt-6 w-full"
        onClick={() => {
          // sidebar 스토어 값을 변경함에 따라 => 로그인 패널이 열려야 함
          openSecondarySidebar('profile');
        }}
      >
        + SIGN IN
      </Button>
    </div>
  );
}
