import type { GalaxyMyListData } from '@/types/galaxyMy';

// 더미 데이터 : Galaxy My 리스트
const galaxyDummy: GalaxyMyListData[] = [
  {
    galaxyName: 'My Galaxy 1',
    updatedAt: '2021-01-01',
    planetCount: 10,
    favoriteCount: 10,
  },
  {
    galaxyName: 'My Galaxy 2',
    updatedAt: '2021-01-02',
    planetCount: 20,
    favoriteCount: 20,
  },
  {
    galaxyName: 'My Galaxy 3',
    updatedAt: '2021-01-03',
    planetCount: 30,
    favoriteCount: 30,
  },
];
const galaxiesMy: GalaxyMyListData[] = [];
// 3 배로 증식
for (let i = 0; i < 3; i++) {
  galaxiesMy.push(...galaxyDummy);
}

export default galaxiesMy;
