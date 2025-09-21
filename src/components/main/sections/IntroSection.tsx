import TextType from '../ui/TextType';

export default function IntroSection() {
  const texts = ['SONA', 'Discover. Explore. Create Sound.'];
  const typingSpeed = 75; // ms per char
  const pauseDuration = 1500; // ms between delete→next type

  return (
    <div className="relative w-full flex items-center justify-center snap-start h-screen">
      <div className="relative w-full flex items-center justify-center snap-start h-[100vh]">
        <div className="absolute bottom-[20vh] left-0 w-full z-10 text-center">
          <h1 className="text-[clamp(3rem,4vw,5rem)] font-bold leading-[0.9] tracking-[-0.05em] text-white">
            SONA
          </h1>

          <TextType
            text={texts}
            loop={false} // 마지막 문장 삭제 금지(내부 로직에서 보장)
            typingSpeed={typingSpeed}
            pauseDuration={pauseDuration}
            showCursor={true} // 커서는 마지막 문장 완료 시 내부에서 자동 숨김
            cursorCharacter="|"
            className="mt-4 text-[clamp(1rem,4vw,1.6rem)] leading-relaxed text-text-muted font-light max-w-[600px]"
          />
        </div>
      </div>
    </div>
  );
}
