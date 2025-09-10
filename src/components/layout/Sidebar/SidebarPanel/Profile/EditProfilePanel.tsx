import { useSidebarStore } from '@/stores/sidebarStore';
import PanelHeader from '../PanelHeader';

export default function EditProfilePanel() {
  const { setProfilePanelMode } = useSidebarStore();

  return (
    <>
      <PanelHeader
        title="EDIT PROFILE"
        showBackButton={true}
        onBack={() => setProfilePanelMode('profile')}
      />
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4">
          <div>{/* Edit Profile Content */}</div>
        </div>
      </div>
    </>
  );
}
