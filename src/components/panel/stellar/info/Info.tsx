import { Suspense } from 'react';
import StellarInfo from './StellarInfo';
import { ErrorBoundary } from 'react-error-boundary';

export default function Info() {
  return (
    <div>
      {/* 조건부 렌더링 with Suspense */}
      <ErrorBoundary FallbackComponent={InfoError}>
        <Suspense fallback={<InfoLoading />}>
          <StellarInfo />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// 로딩 컴포넌트
function InfoLoading() {
  return (
    <div className="animate-pulse min-h-[430px] bg-gray-card rounded p-4">
      <div className="h-6 rounded mb-4 w-24"></div>
      <div className="rounded p-4 space-y-4">
        <div className="h-4 bg-gray-600 rounded w-16"></div>
        <div className="h-8 bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-600 rounded w-20"></div>
        <div className="h-4 bg-gray-600 rounded w-32"></div>
        <div className="h-4 bg-gray-600 rounded w-28"></div>
        <div className="h-4 bg-gray-600 rounded w-36"></div>
      </div>
    </div>
  );
}

// 에러 컴포넌트
function InfoError() {
  return <div>Error</div>;
}
