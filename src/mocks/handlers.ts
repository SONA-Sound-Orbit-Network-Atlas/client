// 요청을 가로채고 어떤 응답을 줄지 정의한다.
import { http, HttpResponse } from 'msw';
import { galaxies } from './data/galaxies';

export const handlers = [
  // 갤럭시 목록 조회
  http.get('/galaxies', ({ request }) => {
    console.log('request.method : ', request.method);
    console.log('request.url : ', request.url);

    return HttpResponse.json(galaxies);
  }),
];
