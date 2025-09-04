export interface MenuContent {
  title: string;
}

export const menuContents: Record<string, MenuContent> = {
  profile: {
    title: '프로필',
  },
  galaxy: {
    title: '은하 관리',
  },
  system: {
    title: '시스템 관리',
  },
  alarm: {
    title: '알림 설정',
  },
  settings: {
    title: '시스템 설정',
  },
  help: {
    title: '도움말',
  },
};
