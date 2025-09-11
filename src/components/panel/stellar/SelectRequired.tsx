import { GrCursor } from 'react-icons/gr';
import Iconframe from '@/components/common/Iconframe';

export default function SelectRequired() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <Iconframe color="primary">
          <GrCursor />
        </Iconframe>
        <div className="text-center">
          <strong className="text-white text-md font-semibold">
            SELECT STELLAR
          </strong>
          <p className="mt-2 text-text-muted text-sm">
            CLICK ON A STELLAR TO VIEW
          </p>
        </div>
      </div>
    </div>
  );
}
