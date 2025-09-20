import {
  IntroSection,
  TextSection,
  CTASection,
  mainSections,
} from '../sections';

export default function SectionsList() {
  return (
    <>
      {mainSections.map((section, index) => {
        switch (section.type) {
          case 'intro':
            return <IntroSection key={`intro-${index}`} />;

          case 'text':
            return (
              <TextSection
                key={`text-${index}`}
                title={section.title}
                description={section.description}
                alignment={section.alignment}
              />
            );

          case 'cta':
            return <CTASection key={`cta-${index}`} />;

          default:
            return null;
        }
      })}
    </>
  );
}
