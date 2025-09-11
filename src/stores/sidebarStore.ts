import { create } from 'zustand';
import { SidebarStore } from '../types/sidebar';
import { ProfilePanelStore } from '../types/profile';
import { AuthStore } from '../types/auth';

// 통합 사이드바 스토어 타입
type CombinedSidebarStore = SidebarStore & ProfilePanelStore & AuthStore;

export const useSidebarStore = create<CombinedSidebarStore>((set, get) => ({
  isSecondaryOpen: false,
  selectedMenu: null,
  isLoggedIn: true, // 기본값: 로그인됨 (테스트용)
  profilePanelMode: 'profile', // 기본값: 프로필 모드
  openSecondarySidebar: (menu: string) =>
    set({
      isSecondaryOpen: true,
      selectedMenu: menu,
    }),
  closeSecondarySidebar: () =>
    set({
      isSecondaryOpen: false,
      selectedMenu: null,
    }),
  toggleSecondarySidebar: (menu: string) => {
    const { isSecondaryOpen, selectedMenu } = get();

    // 같은 메뉴를 클릭했고 이미 열려있으면 닫기
    if (isSecondaryOpen && selectedMenu === menu) {
      set({
        isSecondaryOpen: false,
        selectedMenu: null,
      });
    } else {
      // 다른 메뉴를 클릭하거나 닫혀있으면 열기
      set({
        isSecondaryOpen: true,
        selectedMenu: menu,
      });
    }
  },
  setLoginStatus: (status: boolean) =>
    set({
      isLoggedIn: status,
    }),
  setProfilePanelMode: (mode) =>
    set({
      profilePanelMode: mode,
    }),
}));
