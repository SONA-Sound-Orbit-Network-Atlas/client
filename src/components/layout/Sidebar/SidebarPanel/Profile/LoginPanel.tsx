import { FiUser } from 'react-icons/fi';
import { useProfileStore } from '@/stores/useprofileStore';
import Iconframe from '@/components/common/Iconframe';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import TextField from '@/components/common/TextField';

export default function LoginPanel() {
  const { setProfilePanelMode } = useProfileStore();

  return (
    <div className="text-center p-4">
      <div className="flex flex-col items-center mb-[24px]">
        <Iconframe color="primary" size="medium" className="mb-[16px]">
          <FiUser />
        </Iconframe>
        <h3 className="text-white font-semibold text-base">WELCOME BACK</h3>
        <p className="text-text-muted text-sm">
          SIGN IN TO CREATE AND
          <br />
          MANAGE SYSTEMS
        </p>
      </div>
      <div className="flex flex-col mt-[24px] text-left gap-[16px]">
        <TextField label="Email" htmlFor="email">
          <TextInput type="email" placeholder="Enter your email" id="email" />
        </TextField>
        <TextField label="Password" htmlFor="password">
          <TextInput
            type="password"
            placeholder="Enter your password"
            id="password"
          />
        </TextField>
      </div>
      <Button color="primary" size="lg" className="w-full mt-[24px]">
        SIGN IN
      </Button>
      <div className="flex justify-center mt-[24px] mb-[24px]">
        <a
          href="#"
          className="text-primary-300 text-xs hover:text-primary-200 transition-colors cursor-pointer"
        >
          FORGOT PASSWORD?
        </a>
      </div>
      <div className="flex flex-col items-center border-t border-gray-border pt-[24px]">
        <p className="text-text-muted text-xs mb-[8px]">
          DON'T HAVE AN ACCOUNT?
        </p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setProfilePanelMode('signup');
          }}
          className="text-primary-300 text-sm font-semibold hover:text-primary-200 transition-colors cursor-pointer"
        >
          SIGN UP
        </a>
      </div>
    </div>
  );
}
