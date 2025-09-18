import { TitleText, BodyText } from '../ui/Text';

type TextSectionProps = {
  title: string;
  description: string;
  alignment?: 'left' | 'center' | 'right';
};

export default function TextSection({
  title,
  description,
  alignment = 'center',
}: TextSectionProps) {
  const getAlignmentClasses = () => {
    switch (alignment) {
      case 'left':
        return 'absolute top-[22vh] left-[8vw] w-[600px] z-10';
      case 'right':
        return 'absolute top-[22vh] right-[8vw] w-[600px] z-10 text-right';
      case 'center':
      default:
        return 'text-center';
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center snap-start h-[80vh]">
      <div className={getAlignmentClasses()}>
        <TitleText>{title}</TitleText>
        <BodyText>{description}</BodyText>
      </div>
    </div>
  );
}
