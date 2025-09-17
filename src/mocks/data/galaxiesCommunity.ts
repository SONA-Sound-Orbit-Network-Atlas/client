// src/mocks/data/galaxiesCommunity.ts
import type {
  GalaxyCommunityItem,
  GalaxyCommunityResponse,
} from '@/types/galaxyCommunity';

const data: GalaxyCommunityItem[] = [
  {
    id: 'sys-001',
    title: 'Galaxy 1', // ← galaxyName → title
    galaxy_id: '', // 목 데이터에 없던 필드라 빈 문자열 처리(필요시 채워넣으세요)
    creator_id: 'user-1', // ← userId → creator_id
    author_id: 'user-1', // 목: 동일 값 사용
    created_at: '2021-01-01', // 목: updatedAt 재사용/임의 지정
    updated_at: '2021-01-01', // ← updatedAt → updated_at
    like_count: 10, // ← favoriteCount → like_count
    planet_count: 10, // ← planetCount → planet_count
    rank: 1,
  },
  {
    id: 'sys-002',
    title: 'Galaxy 2',
    galaxy_id: '',
    creator_id: 'user-2',
    author_id: 'user-2',
    created_at: '2021-01-02',
    updated_at: '2021-01-02',
    like_count: 20,
    planet_count: 20,
    rank: 2,
  },
  {
    id: 'sys-003',
    title: 'Galaxy 3',
    galaxy_id: '',
    creator_id: 'user-3',
    author_id: 'user-3',
    created_at: '2021-01-03',
    updated_at: '2021-01-03',
    like_count: 30,
    planet_count: 30,
    rank: 3,
  },
  {
    id: 'sys-004',
    title: 'Galaxy 4',
    galaxy_id: '',
    creator_id: 'user-4',
    author_id: 'user-4',
    created_at: '2021-01-04',
    updated_at: '2021-01-04',
    like_count: 40,
    planet_count: 40,
    rank: 4,
  },
  {
    id: 'sys-005',
    title: 'Galaxy 5',
    galaxy_id: '',
    creator_id: 'user-5',
    author_id: 'user-5',
    created_at: '2021-01-05',
    updated_at: '2021-01-05',
    like_count: 50,
    planet_count: 50,
    rank: 5,
  },
  {
    id: 'sys-006',
    title: 'Galaxy 6',
    galaxy_id: '',
    creator_id: 'user-6',
    author_id: 'user-6',
    created_at: '2021-01-06',
    updated_at: '2021-01-06',
    like_count: 60,
    planet_count: 60,
    rank: 6,
  },
];

// 백엔드 원형 응답 형태로 export
const galaxiesCommunity: GalaxyCommunityResponse = {
  data,
  meta: {
    page: 1,
    limit: 20,
    total: data.length,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

export default galaxiesCommunity;
