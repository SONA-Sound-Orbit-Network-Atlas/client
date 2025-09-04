import React from 'react';
import Info from '@/components/panel/system/info/Info';
import GalaxyIndex from '@/components/panel/galaxy/Index';
import PlanetsIndex from '@/components/panel/system/planets/Index';
import PropertiesIndex from '@/components/panel/system/properties/Index';

const Panel: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          Panel 컴포넌트
        </h1>

        {/* Galaxy Systems 컴포넌트 */}
        <section className="mb-12 p-6 border rounded-lg h-[700px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Galaxy Systems 컴포넌트
          </h2>
          <GalaxyIndex />
        </section>

        {/* System INFO 컴포넌트 */}
        <section className="mb-12 p-6 border rounded-lg ">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            System INFO 컴포넌트
          </h2>
          <Info />
        </section>

        {/* System PLANETS 컴포넌트 */}
        <section className="mb-12 p-6 border rounded-lg ">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            System PLANETS 컴포넌트
          </h2>
          <PlanetsIndex />
        </section>

        {/* System PROPERTIES 컴포넌트 */}
        <section className="mb-12 p-6 border rounded-lg ">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            System PROPERTIES 컴포넌트
          </h2>
          <PropertiesIndex />
        </section>
      </div>
    </div>
  );
};

export default Panel;
