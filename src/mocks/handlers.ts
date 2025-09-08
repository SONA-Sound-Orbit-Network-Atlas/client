// 핸들러 : 요청을 가로채고 어떤 응답을 줄지 정의한다.
import galaxiesCommunity from './data/galaxiesCommunity';
import galaxiesMy from './data/galaxiesMy';
import { planet, planets, star } from './data/system';
import { mockFetch, mockFetchInfinite } from './utils';

export const handlers = [
  // galaxy Community 리스트트 조회 (infinite)
  mockFetchInfinite('/galaxies/community', galaxiesCommunity, 2000),

  // galaxy My 리스트트 조회 (infinite)
  mockFetchInfinite('/galaxies/my', galaxiesMy, 2000),

  // system 별 개별 정보 조회
  mockFetch('/systems/:galaxyId/star', star, 2000),

  // system 행성 개별 정보 조회
  mockFetch('/systems/:galaxyId/planets/:planetNo', planet, 2000),

  // system 별+행성 목록 조회
  mockFetch('/systems/:galaxyId/planets', planets, 2000),
];
