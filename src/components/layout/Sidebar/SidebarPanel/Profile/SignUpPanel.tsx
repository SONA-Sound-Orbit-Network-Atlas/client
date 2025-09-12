import { FiUserPlus } from 'react-icons/fi';
import { useProfileStore } from '@/stores/useprofileStore';
import Iconframe from '@/components/common/Iconframe';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import TextField from '@/components/common/TextField';
import PanelHeader from '../PanelHeader';

export default function SignUpPanel() {
  const { setProfilePanelMode } = useProfileStore();

  return (
    <>
      <PanelHeader
        title="SIGN UP"
        showBackButton={true}
        onBack={() => setProfilePanelMode('login')}
      />
      <div className="text-center p-4">
        <div className="flex flex-col items-center mb-[24px]">
          <Iconframe color="secondary" size="medium" className="mb-[16px]">
            <FiUserPlus />
          </Iconframe>
          <h3 className="text-white font-semibold text-base">JOIN SONA</h3>
          <p className="text-text-muted text-sm">
            CREATE YOUR ACCOUNT TO
            <br />
            START COMPOSING
          </p>
        </div>
        <div className="flex flex-col mt-[24px] text-left gap-[16px]">
          <TextField label="USERNAME" htmlFor="signup-name">
            <TextInput
              type="text"
              placeholder="Enter your username"
              id="signup-name"
            />
          </TextField>
          <TextField label="Email" htmlFor="signup-email">
            <TextInput
              type="email"
              placeholder="Enter your email"
              id="signup-email"
            />
          </TextField>

          <TextField label="Password" htmlFor="signup-password">
            <TextInput
              type="password"
              placeholder="Enter your password"
              id="signup-password"
            />
          </TextField>

          <TextField label="Confirm Password" htmlFor="signup-confirm-password">
            <TextInput
              type="password"
              placeholder="Confirm your password"
              id="signup-confirm-password"
            />
          </TextField>
        </div>
        <Button color="primary" size="lg" className="w-full mt-[24px]">
          CREATE ACCOUNT
        </Button>
        <div className="flex flex-col items-center border-t border-gray-border pt-[24px] mt-[24px]">
          <p className="text-text-muted text-xs mb-[8px]">
            ALREADY HAVE AN ACCOUNT?
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setProfilePanelMode('login');
            }}
            className="text-secondary-300 text-sm font-semibold hover:text-secondary-200 transition-colors cursor-pointer"
          >
            SIGN IN
          </a>
        </div>
      </div>
    </>
  );
}
