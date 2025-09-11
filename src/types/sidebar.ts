// 사이드바 상태 관련 타입
export interface SidebarState {
  isSecondaryOpen: boolean;
  selectedMenu: string | null;
}

// 사이드바 액션 관련 타입
export interface SidebarActions {
  openSecondarySidebar: (menu: string) => void;
  closeSecondarySidebar: () => void;
  toggleSecondarySidebar: (menu: string) => void;
}

// 통합 사이드바 타입
export type SidebarStore = SidebarState & SidebarActions;
