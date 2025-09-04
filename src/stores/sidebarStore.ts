import { create } from 'zustand';

interface SidebarState {
  isSecondaryOpen: boolean;
  selectedMenu: string | null;
  isLoggedIn: boolean;
  profilePanelMode: 'login' | 'signup';
  openSecondarySidebar: (menu: string) => void;
  closeSecondarySidebar: () => void;
  toggleSecondarySidebar: (menu: string) => void;
  setLoginStatus: (status: boolean) => void;
  setProfilePanelMode: (mode: 'login' | 'signup') => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isSecondaryOpen: false,
  selectedMenu: null,
  isLoggedIn: false, // 기본값: 로그인 안됨
  profilePanelMode: 'login', // 기본값: 로그인 모드
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
  setProfilePanelMode: (mode: 'login' | 'signup') =>
    set({
      profilePanelMode: mode,
    }),
}));
