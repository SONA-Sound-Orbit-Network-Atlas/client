// 핸들러 : 요청을 가로채고 어떤 응답을 줄지 정의한다.
import { http, HttpResponse } from 'msw';
import galaxiesCommunity from './data/galaxiesCommunity';
import galaxiesMy from './data/galaxiesMy';
import { stellar } from './data/stellar';
import { mockFetch, mockFetchInfinite } from './utils';

const isLoggedIn = true; // 로그인 여부 테스트용

export const handlers = [
  // 세션 확인
  http.get('/api/auth/session', async () => {
    if (!isLoggedIn) {
      // 비로그인: 401
      return new HttpResponse(null, { status: 401 });
    }
    // 로그인: 200 + 유저 정보
    return HttpResponse.json({ userId: 'u_1', email: 'dev@example.com' });
  }),

  // 로그인
  http.post('/api/auth/login', async () => {
    return HttpResponse.json({ email: 'bomin@example.com', username: 'bomin' });
  }),

  // galaxy Community 리스트 조회 (infinite)
  mockFetchInfinite('/galaxies/community', galaxiesCommunity, 3, 2000),

  // galaxy My 리스트 조회 (infinite)
  mockFetchInfinite('/galaxies/my', galaxiesMy, 3, 2000),

  // stellar 정보 조회
  mockFetch('/stellarSystems/:stellarId', stellar, 2000),
];
