import type { GalaxyListData } from '@/types/galaxy';

// 더미 데이터 : 은하 리스트
const galaxyDummy: GalaxyListData[] = [
  {
    rank: 1,
    galaxyName: 'Galaxy 1',
    makerName: 'Maker 1',
    createdAt: '2021-01-01',
    planetCount: 10,
    favoriteCount: 10,
    myFavorite: true,
  },
  {
    rank: 2,
    galaxyName: 'Galaxy 2',
    makerName: 'Maker 2',
    createdAt: '2021-01-02',
    planetCount: 20,
    favoriteCount: 20,
    myFavorite: false,
  },
  {
    rank: 3,
    galaxyName: 'Galaxy 3',
    makerName: 'Maker 3',
    createdAt: '2021-01-03',
    planetCount: 30,
    favoriteCount: 30,
    myFavorite: false,
  },
];
const galaxies: GalaxyListData[] = [];
// 3 배로 증식
for (let i = 0; i < 3; i++) {
  galaxies.push(...galaxyDummy);
}

export default galaxies;
