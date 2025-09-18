import type { Galaxy, simpleStellar } from '@/types/galaxy';

// 갤럭시 목 데이터 생성
const createGalaxyMock = (galaxyId: string): Galaxy => {
  const stellarSystems: simpleStellar[] = [
    {
      id: 'sys-001',
      title: 'Stellar System 1',
      position: [0, 0, 0],
      color: 120, // 노란색 계열
    },
    {
      id: 'sys-002',
      title: 'Stellar System 2',
      position: [20, 0, 0],
      color: 240, // 파란색 계열
    },
    {
      id: 'sys-003',
      title: 'Stellar System 3',
      position: [30, 0, 0],
      color: 0, // 빨간색 계열
    },
    {
      id: 'sys-004',
      title: 'Stellar System 4',
      position: [0, -20, 30],
      color: 60, // 초록색 계열
    },
    {
      id: 'sys-005',
      title: 'Stellar System 5',
      position: [0, -20, 10],
      color: 300, // 보라색 계열
    },
    {
      id: 'sys-006',
      title: 'Stellar System 6',
      position: [0, 0, 400],
      color: 180, // 청록색 계열
    },
    {
      id: 'sys-007',
      title: 'Stellar System 7',
      position: [0, 0, -2000],
      color: 30, // 주황색 계열
    },
    {
      id: 'sys-008',
      title: 'Stellar System 8',
      position: [-30, 20, 0],
      color: 90, // 연두색 계열
    },
    {
      id: 'sys-009',
      title: 'Stellar System 9',
      position: [40, -30, 50],
      color: 270, // 분홍색 계열
    },
    {
      id: 'sys-010',
      title: 'Stellar System 10',
      position: [-20, 40, -100],
      color: 150, // 민트색 계열
    },
  ];

  return {
    id: galaxyId,
    createdAt: '2021-01-01T00:00:00Z',
    updatedAt: '2021-01-01T00:00:00Z',
    allStellarList: stellarSystems,
  };
};

// 갤럭시 목 데이터 가져오기
export const getGalaxyMock = (galaxyId: string): Galaxy => {
  return createGalaxyMock(galaxyId);
};
