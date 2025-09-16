import React, { useMemo } from 'react';
import { PARAMETER_CONFIG, getSliderConfig } from '../audio/utils/parameterConfig';
import type { PlanetPhysicalProperties } from '../types/audio';

interface ConfigBasedSliderProps {
  planetId: string;
  properties: PlanetPhysicalProperties;
  onUpdate: (id: string, key: keyof PlanetPhysicalProperties, value: number) => void;
}

// 설정 기반 슬라이더 컴포넌트 - 파라미터 변경에 강건함
const ConfigBasedSliders: React.FC<ConfigBasedSliderProps> = ({ 
  planetId, 
  properties, 
  onUpdate 
}) => {
  // 카테고리별 파라미터 그룹화 (메모화로 성능 최적화)
  const parametersByCategory = useMemo(() => {
    const groups: Record<string, Array<{ 
      name: string; 
      config: typeof PARAMETER_CONFIG[string];
      sliderConfig: ReturnType<typeof getSliderConfig>;
    }>> = {
      sound: [],
      pattern: [],
      pitch: [],
      other: []
    };

    Object.entries(PARAMETER_CONFIG).forEach(([paramName, config]) => {
      const sliderConfig = getSliderConfig(paramName);
      if (sliderConfig) {
        const category = config.category || 'other';
        groups[category].push({ name: paramName, config, sliderConfig });
      }
    });

    return groups;
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sound': return 'text-red-300';
      case 'pattern': return 'text-green-300';
      case 'pitch': return 'text-blue-300';
      default: return 'text-gray-300';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'sound': return '🎵 음색 & 이펙트';
      case 'pattern': return '🎼 패턴 & 리듬';
      case 'pitch': return '🎹 피치 & 멜로디';
      default: return '⚙️ 기타';
    }
  };

  return (
    <div className="space-y-4 text-sm">
      {Object.entries(parametersByCategory).map(([category, params]) => {
        if (params.length === 0) return null;
        
        return (
          <div key={category} className="border border-gray-600 rounded p-3">
            <h4 className={`text-sm font-semibold mb-3 ${getCategoryColor(category)}`}>
              {getCategoryTitle(category)}
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {params.map(({ name: paramName, config, sliderConfig }) => {
                if (!sliderConfig) return null;
                const currentValue = (properties as unknown as Record<string, number>)[paramName] || sliderConfig.defaultValue;
                
                return (
                  <div key={paramName} className="border border-gray-700 p-2 rounded">
                    <label className="block mb-1 font-semibold">
                      {config.label}: {currentValue.toFixed(config.step && config.step < 1 ? 3 : 1)}
                      {paramName.includes('Color') && '°'}
                    </label>
                    <input
                      type="range"
                      min={sliderConfig.min}
                      max={sliderConfig.max}
                      step={sliderConfig.step}
                      value={currentValue}
                      onChange={(e) => onUpdate(planetId, paramName as keyof PlanetPhysicalProperties, parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConfigBasedSliders;
