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
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { getObjectNameById } from '@/utils/getObjectName';

export default function StellarIndex() {
  const { stellarStore } = useStellarStore();
  const { userStore } = useUserStore();
  const { mode } = useSelectedStellarStore();
  const { tabValue, setTabValue } = useStellarTabStore();
  const { selectedObjectId } = useSelectedObjectStore();
  const isStellarOwner = stellarStore.creator_id === userStore.id;

  const selectedObjectName = getObjectNameById(selectedObjectId);

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
                // disabled={!isStellarOwner && mode === 'view'}
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
              <p className="px-4 ">
                <span className="text-sm text-text-muted">
                  {selectedObjectName}
                </span>
              </p>
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
