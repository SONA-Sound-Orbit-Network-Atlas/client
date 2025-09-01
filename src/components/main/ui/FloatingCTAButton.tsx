import { useNavigate } from 'react-router-dom';

type FloatingCTAButtonProps = {
  isVisible: boolean;
  isInCTASection: boolean;
};

export default function FloatingCTAButton({
  isVisible,
  isInCTASection,
}: FloatingCTAButtonProps) {
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    <button
      className={`fixed z-50 bg-transparent rounded-2xl py-5 px-10 text-[clamp(18px,2.5vw,24px)] font-semibold text-white cursor-pointer transition-all duration-300 ease-in-out min-w-[200px] hover:bg-black hover:border-white hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] 
        ${
          isInCTASection
            ? 'border-2 border-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_30px_rgba(255,255,255,0.2)]'
            : 'bottom-[5%] right-[5%] translate-x-0 translate-y-0 scale-70 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
        }`}
      onClick={() => navigate('/galaxy')}
    >
      go to Galaxy
    </button>
  );
}
