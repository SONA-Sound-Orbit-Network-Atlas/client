import { create } from 'zustand';

interface SidebarState {
  isSecondaryOpen: boolean;
  selectedMenu: string | null;
  openSecondarySidebar: (menu: string) => void;
  closeSecondarySidebar: () => void;
  toggleSecondarySidebar: (menu: string) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isSecondaryOpen: false,
  selectedMenu: null,
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
}));
