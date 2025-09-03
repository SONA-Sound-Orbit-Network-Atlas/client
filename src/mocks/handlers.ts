// 핸들러 : 요청을 가로채고 어떤 응답을 줄지 정의한다.
import galaxies from './data/galaxies';
import { mockFetchInfinite } from './utils';

export const handlers = [
  // 갤럭시 목록 조회 (infinite)
  mockFetchInfinite('/galaxies', galaxies),
];
