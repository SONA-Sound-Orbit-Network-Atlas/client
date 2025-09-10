import { useSidebarStore } from '@/stores/sidebarStore';
import PanelHeader from '../PanelHeader';
import Iconframe from '@/components/common/Iconframe';
import { FiUser } from 'react-icons/fi';
import TextField from '@/components/common/textField';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import { ScrollArea } from '@/components/common/Scrollarea';
import Textarea from '@/components/common/Textarea';

export default function EditProfilePanel() {
  const { setProfilePanelMode } = useSidebarStore();

  return (
    <>
      <PanelHeader
        title="EDIT PROFILE"
        showBackButton={true}
        onBack={() => setProfilePanelMode('profile')}
      />
      <div className="flex flex-col h-full overflow-hidden items-center">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 flex flex-col">
            <div className="text-center">
              <Iconframe color="primary" size="large" className="mb-[16px]">
                <FiUser />
              </Iconframe>
              <p className="text-primary-300 text-sm text-center">
                CHANGE AVATAR
              </p>
            </div>
            {/* EDIT PROFILE */}
            <div className="w-full border-b border-gray-border pb-[24px]">
              <div className="w-full mt-[24px] gap-[20px] flex flex-col">
                <TextField label="DISPLAY NAME" htmlFor="display-name">
                  <TextInput
                    type="text"
                    placeholder="Enter your display name"
                    id="display-name"
                  />
                </TextField>
                <TextField label="EMAIL" htmlFor="email">
                  <TextInput
                    type="text"
                    placeholder="Enter your email"
                    id="email"
                  />
                </TextField>
                <TextField label="ABOUT" htmlFor="about">
                  <Textarea
                    placeholder="Tell us about yourself..."
                    id="about"
                  />
                </TextField>
              </div>
              <div className="w-full">
                <Button color="primary" size="lg" className="w-full mt-[24px]">
                  SAVE CHANGES
                </Button>
              </div>
            </div>
            {/* CHANGE PASSWORD */}
            <div className="mt-[24px] border-b border-gray-border pb-[24px]">
              <h3 className="text-secondary-300 font-semibold mb-[24px]">
                CHANGE PASSWORD
              </h3>
              <div className="w-full gap-[20px] flex flex-col">
                <TextField label="CURRENT PASSWORD" htmlFor="current-password">
                  <TextInput
                    type="password"
                    placeholder="Enter current password"
                    id="current-password"
                  />
                </TextField>
                <TextField label="NEW PASSWORD" htmlFor="new-password">
                  <TextInput
                    type="password"
                    placeholder="Enter new password"
                    id="new-password"
                  />
                </TextField>
                <TextField
                  label="CONFIRM NEW PASSWORD"
                  htmlFor="confirm-new-password"
                >
                  <TextInput
                    type="password"
                    placeholder="Confirm new password"
                    id="confirm-new-password"
                  />
                </TextField>
              </div>
              <div className="w-full">
                <Button color="primary" size="lg" className="w-full mt-[24px]">
                  SAVE CHANGES
                </Button>
              </div>
            </div>
            <div className="w-full">
              <p className="text-text-muted text-sm mt-[24px] text-center">
                DEACTIVATE ACCOUNT
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
