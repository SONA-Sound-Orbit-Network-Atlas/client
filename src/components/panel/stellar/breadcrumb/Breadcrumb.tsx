import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useStellarStore } from '@/stores/useStellarStore';
import { getObjectNameById } from '@/utils/getObjectName';

export default function Breadcrumb() {
  const { stellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();
  const selectedObjectName = getObjectNameById(selectedObjectId);
  const selectedStellarTitle = stellarStore.title;

  return (
    <p className="px-4 ">
      <span className="text-sm text-text-muted/90">{`${selectedStellarTitle} > ${selectedObjectName}`}</span>
    </p>
  );
}
