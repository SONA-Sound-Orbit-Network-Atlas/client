import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/common/Tabs';
import Info from './info/Info';
import Objects from './objects/Objects';
import Properties from './properties/Properties';
import { useStellarStore } from '@/stores/useStellarStore';
import { useUserStore } from '@/stores/useUserStore';
import { useStellarTabStore } from '@/stores/useStellarTabStore';

export default function StellarIndex() {
  // isStellarOwner : 현재 선택된 Stellar의 userId 가 현재 로그인된 userId와 일치하는가?
  // true  => Stellar 패널 수정 모드
  // false => Stellar 패널 관람 모드 (+ PLANETS, PROPERTIES 패널 비활성화)
  const { stellarStore } = useStellarStore();
  const { userStore } = useUserStore();
  const isStellarOwner = stellarStore.userId === userStore.userId;

  // Stellar 패널 Tab value 스토어
  const { tabValue, setTabValue } = useStellarTabStore();

  return (
    <div>
      <Tabs
        className="w-full gap-0"
        defaultValue={tabValue}
        value={tabValue}
        onValueChange={(v) => setTabValue(v as typeof tabValue)}
      >
        <TabsList className="grid w-full [grid-template-columns:repeat(3,minmax(max-content,1fr))] gap-0">
          <TabsTrigger value="INFO">INFO</TabsTrigger>
          <TabsTrigger value="OBJECTS" disabled={!isStellarOwner}>
            OBJECTS
          </TabsTrigger>
          <TabsTrigger value="PROPERTIES" disabled={!isStellarOwner}>
            PROPERTIES
          </TabsTrigger>
        </TabsList>
        <TabsContent value="INFO" className="p-4">
          <Info isStellarOwner={isStellarOwner} />
        </TabsContent>
        <TabsContent value="OBJECTS" className="p-4">
          <Objects />
        </TabsContent>
        <TabsContent value="PROPERTIES" className="p-4">
          <Properties />
        </TabsContent>
      </Tabs>
    </div>
  );
}
