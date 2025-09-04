// AudioTestPage - 오디오 테스트 전용 페이지
// 독립적인 테스트 환경을 제공합니다.

import AudioTestPanel from '../components/AudioTestPanel';

export default function AudioTestPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            🌌 SONA Audio Engine Test
          </h1>
          <p className="text-gray-400">
            Tri Hybrid 기반 행성-음향 매핑 시스템 테스트
          </p>
        </div>
        
        <AudioTestPanel />
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            🎛️ 각 행성의 물리적 속성이 실시간으로 음향 파라미터에 매핑됩니다<br/>
            🎵 패턴 루프를 활성화하여 리듬 패턴을 테스트하세요<br/>
            ⭐ 항성 설정으로 전역 BPM, 키, 스케일을 조정할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
