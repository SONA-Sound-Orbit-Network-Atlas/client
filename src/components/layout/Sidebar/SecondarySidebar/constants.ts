export interface MenuOption {
  title: string;
  description: string;
}

export interface MenuContent {
  title: string;
  items: MenuOption[];
}

export const menuContents: Record<string, MenuContent> = {
  user: {
    title: '사용자 관리',
    items: [
      { title: '사용자 프로필', description: '개인 정보 및 설정 관리' },
      { title: '권한 관리', description: '사용자 권한 및 역할 설정' },
      { title: '활동 기록', description: '사용자 활동 및 작업 내역' },
      { title: '친구 목록', description: '연결된 사용자 및 친구 관리' },
    ],
  },
  galaxy: {
    title: '은하 관리',
    items: [
      { title: '은하 생성', description: '새로운 은하 생성 및 설정' },
      { title: '은하 구조', description: '은하 형태 및 구조 편집' },
      { title: '별 분포', description: '별들의 분포 및 밀도 설정' },
      { title: '은하 환경', description: '은하 내 환경 및 조건 설정' },
    ],
  },
  system: {
    title: '시스템 관리',
    items: [
      { title: '시스템 설정', description: '전체 시스템 설정 및 구성' },
      { title: '성능 모니터링', description: '시스템 성능 및 상태 확인' },
      { title: '보안 설정', description: '보안 및 인증 설정' },
      { title: '백업 및 복원', description: '데이터 백업 및 복원 관리' },
    ],
  },
  alarm: {
    title: '알림 설정',
    items: [
      { title: '시스템 알림', description: '시스템 이벤트 및 경고 설정' },
      { title: '작업 완료', description: '작업 완료 시 알림 설정' },
      { title: '오류 알림', description: '오류 발생 시 알림 설정' },
      { title: '일정 알림', description: '예약된 작업 및 일정 알림' },
    ],
  },
  settings: {
    title: '시스템 설정',
    items: [
      { title: '일반 설정', description: '기본 시스템 설정 및 환경' },
      { title: '성능 설정', description: '성능 및 최적화 옵션' },
      { title: '보안 설정', description: '보안 및 인증 설정' },
      { title: '백업 설정', description: '데이터 백업 및 복원 설정' },
    ],
  },
  help: {
    title: '도움말',
    items: [
      { title: '사용자 가이드', description: '기능 사용법 및 튜토리얼' },
      { title: 'FAQ', description: '자주 묻는 질문 및 답변' },
      { title: '문의하기', description: '지원팀에 문의 및 피드백' },
      { title: '업데이트', description: '최신 버전 정보 및 다운로드' },
    ],
  },
};
