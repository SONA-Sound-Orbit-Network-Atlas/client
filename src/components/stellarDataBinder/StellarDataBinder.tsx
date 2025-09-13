import { useGetStellar } from '@/hooks/api/useStellar';

// useGetStellar 훅을 직접 컴포넌트에서 구독해서 사용하지 않기에 => 항시 구독해있도록 Sidebar 컴포넌트에 마운트
export default function StellarDataBinder() {
  useGetStellar(); // 마운트되는 동안 쿼리<->스토어 동기화
  return null;
}
