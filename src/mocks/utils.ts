// src/mocks/utils.ts
import { http, HttpResponse, type JsonBodyType, delay } from 'msw';

/**
 * 무한 스크롤/페이지네이션 지원 mock 핸들러
 * @param path 엔드포인트 경로 (ex. '/galaxies')
 * @param data 전체 mock 데이터 (totalCount와 list를 포함한 객체)
 */

export function mockFetchInfiniteDataMeta<T>(
  path: string,
  source: T[] | { data: T[] },
  defaultLimit = 20,
  delayMs = 0
) {
  return http.get(path, async ({ request }) => {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const limit = Math.max(
      1,
      Number(url.searchParams.get('limit') ?? String(defaultLimit))
    );

    const all: T[] = Array.isArray(source) ? source : (source.data ?? []);
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const start = (page - 1) * limit;
    const end = start + limit;
    const data = all.slice(start, end);

    if (delayMs > 0) await delay(delayMs);

    return HttpResponse.json({
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  });
}

export function mockFetchInfinite<T>(
  path: string,
  data: { totalCount: number; list: T[] },
  limit: number,
  delayMs: number = 0
) {
  return http.get(path, async () => {
    const page = 1;

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = data.list.slice(start, end);

    if (delayMs > 0) {
      await delay(delayMs); // 딜레이 추가
    }

    return HttpResponse.json({
      list: items,
      totalCount: data.totalCount,
    });
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
