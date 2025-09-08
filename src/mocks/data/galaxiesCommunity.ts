import type { GalaxyCommunityListData } from '@/types/galaxyCommunity';

// 더미 데이터 : Galaxy Community 리스트
const galaxyDummy: GalaxyCommunityListData[] = [
  {
    rank: 1,
    galaxyName: 'Galaxy 1',
    makerName: 'Maker 1',
    updatedAt: '2021-01-01',
    planetCount: 10,
    favoriteCount: 10,
    myFavorite: true,
  },
  {
    rank: 2,
    galaxyName: 'Galaxy 2',
    makerName: 'Maker 2',
    updatedAt: '2021-01-02',
    planetCount: 20,
    favoriteCount: 20,
    myFavorite: false,
  },
  {
    rank: 3,
    galaxyName: 'Galaxy 3',
    makerName: 'Maker 3',
    updatedAt: '2021-01-03',
    planetCount: 30,
    favoriteCount: 30,
    myFavorite: false,
  },
];
const galaxiesCommunity: GalaxyCommunityListData[] = [];
// 3 배로 증식
for (let i = 0; i < 3; i++) {
  galaxiesCommunity.push(...galaxyDummy);
}

export default galaxiesCommunity;
