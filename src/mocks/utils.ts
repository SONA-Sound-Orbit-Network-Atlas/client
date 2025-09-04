// src/mocks/utils.ts
import { http, HttpResponse, type JsonBodyType, delay } from 'msw';

/**
 * 무한 스크롤/페이지네이션 지원 mock 핸들러
 * @param path 엔드포인트 경로 (ex. '/galaxies')
 * @param data 전체 mock 데이터 배열
 */
export function mockFetchInfinite<T>(
  path: string,
  data: T[],
  delayMs: number = 0
) {
  return http.get(path, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '10');

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = data.slice(start, end);

    if (delayMs > 0) {
      await delay(delayMs); // 딜레이 추가
    }

    return HttpResponse.json(items);
  });
}

/**
 * 단순 fetch mock 핸들러 (전체 반환)
 * @param path 엔드포인트 경로 (ex. '/systems')
 * @param data 반환할 mock 데이터(배열이든 객체든 가능)
 */
export function mockFetch<T>(path: string, data: T, delayMs: number = 0) {
  return http.get(path, async () => {
    if (delayMs > 0) {
      await delay(delayMs); // 딜레이 추가
    }
    return HttpResponse.json(data as JsonBodyType);
  });
}
