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
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import SelectRequired from './SelectRequired';
import { ScrollArea } from '@/components/common/Scrollarea';
import AudioPlayer from './audioPlayer/Index';

export default function StellarIndex() {
  // 현재 선택된 stellarId
  const { mode } = useSelectedStellarStore();

  // isStellarOwner : 현재 선택된 Stellar의 owner_id 가 현재 로그인된 userId와 일치하는가?
  // true 수정 모드 / false 관람 모드
  const { stellarStore } = useStellarStore();
  const { userStore } = useUserStore();
  const isStellarOwner = stellarStore.owner_id === userStore.id;
  console.log('isStellarOwner', isStellarOwner);

  // Stellar 패널 Tab value 스토어
  const { tabValue, setTabValue } = useStellarTabStore();

  return (
    <>
      {mode === 'idle' ? (
        <div className="w-full h-full flex justify-center pt-[64px]">
          <SelectRequired />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col">
          <Tabs
            className="w-full h-full flex flex-col overflow-hidden flex-1"
            defaultValue={tabValue}
            value={tabValue}
            onValueChange={(v) => setTabValue(v as typeof tabValue)}
          >
            <TabsList className="grid w-full [grid-template-columns:repeat(3,minmax(max-content,1fr))] gap-0 shrink-0">
              <TabsTrigger value="INFO">INFO</TabsTrigger>
              <TabsTrigger
                value="OBJECTS"
                disabled={!isStellarOwner && mode === 'view'}
              >
                OBJECTS
              </TabsTrigger>
              <TabsTrigger
                value="PROPERTIES"
                disabled={!isStellarOwner && mode === 'view'}
              >
                PROPERTIES
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <TabsContent value="INFO" className="p-4">
                  <Info isStellarOwner={isStellarOwner} />
                </TabsContent>
                <TabsContent value="OBJECTS" className="p-4">
                  <Objects />
                </TabsContent>
                <TabsContent value="PROPERTIES" className="p-4">
                  <Properties />
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
          <AudioPlayer className="w-full h-[49px] border-t border-gray-border" />
        </div>
      )}
    </>
  );
}
