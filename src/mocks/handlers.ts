// 핸들러 : 요청을 가로채고 어떤 응답을 줄지 정의한다.
import galaxies from './data/galaxies';
import { planet, planets, star } from './data/system';
import { mockFetch, mockFetchInfinite } from './utils';

export const handlers = [
  // galaxy 은하 목록 조회 (infinite)
  mockFetchInfinite('/galaxies', galaxies, 2000),

  // system 별 개별 정보 조회
  mockFetch('/systems/:galaxyId/star', star, 2000),

  // system 행성 개별 정보 조회
  mockFetch('/systems/:galaxyId/planets/:planetNo', planet, 2000),

  // system 별+행성 목록 조회
  mockFetch('/systems/:galaxyId/planets', planets, 2000),
];
