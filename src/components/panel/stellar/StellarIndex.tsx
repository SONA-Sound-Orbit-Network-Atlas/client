import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/common/Tabs';
import Info from './info/Info';
import Objects from './objects/Objects';
import Properties from './properties/Properties';

export default function StellarIndex() {
  return (
    <div>
      <Tabs defaultValue="INFO" className="w-full gap-0">
        <TabsList className="grid w-full [grid-template-columns:repeat(3,minmax(max-content,1fr))] gap-0">
          <TabsTrigger value="INFO">INFO</TabsTrigger>
          <TabsTrigger value="OBJECTS">OBJECTS</TabsTrigger>
          <TabsTrigger value="PROPERTIES">PROPERTIES</TabsTrigger>
        </TabsList>
        <TabsContent value="INFO" className="p-4">
          <Info />
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
