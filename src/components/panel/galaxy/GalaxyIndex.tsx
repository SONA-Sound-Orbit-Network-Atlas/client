import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/common/Tabs';
import GalaxyCommunity from './community/GalaxyCommunity';
import GalaxyMy from './my/GalaxyMy';
import { ScrollArea } from '@/components/common/Scrollarea';

export default function GalaxyIndex() {
  return (
    <Tabs
      defaultValue="COMMUNITY"
      className="w-full h-full flex flex-col overflow-hidden"
    >
      <TabsList className="grid w-full grid-cols-2 shrink-0">
        <TabsTrigger value="COMMUNITY">COMMUNITY</TabsTrigger>
        <TabsTrigger value="MY">MY</TabsTrigger>
      </TabsList>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <TabsContent value="COMMUNITY" className="p-4">
            <GalaxyCommunity />
          </TabsContent>
          <TabsContent value="MY" className="p-4">
            <GalaxyMy />
          </TabsContent>
        </ScrollArea>
      </div>
    </Tabs>
  );
}
