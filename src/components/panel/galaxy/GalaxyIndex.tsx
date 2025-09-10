import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/common/Tabs';
import GalaxyCommunity from './community/GalaxyCommunity';
import GalaxyMy from './my/GalaxyMy';

export default function GalaxyIndex() {
  return (
    <div>
      <Tabs
        defaultValue="COMMUNITY"
        className="w-full h-full gap-0 overflow-hidden"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="COMMUNITY">COMMUNITY</TabsTrigger>
          <TabsTrigger value="MY">MY</TabsTrigger>
        </TabsList>
        <TabsContent value="COMMUNITY" className="p-4">
          <GalaxyCommunity />
        </TabsContent>
        <TabsContent value="MY" className="p-4">
          <GalaxyMy />
        </TabsContent>
      </Tabs>
    </div>
  );
}
