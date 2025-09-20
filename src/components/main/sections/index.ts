export { default as IntroSection } from './IntroSection';
export { default as TextSection } from './TextSection';
export { default as CTASection } from './CTASection';

// 섹션 데이터 정의
export type SectionData =
  | { type: 'intro' }
  | {
      type: 'text';
      title: string;
      description: string;
      alignment: 'left' | 'center' | 'right';
    }
  | { type: 'cta' };

export const mainSections: SectionData[] = [
  { type: 'intro' },
  {
    type: 'text',
    title: 'SOUND',
    description: 'linking sound and space for new experiences',
    alignment: 'left',
  },
  {
    type: 'text',
    title: 'ORBIT',
    description: 'translating data into sound to build stories',
    alignment: 'center',
  },
  {
    type: 'text',
    title: 'NETWORK',
    description: 'share music with others',
    alignment: 'right',
  },
  {
    type: 'text',
    title: 'ATLAS',
    description: 'bringing it all together',
    alignment: 'center',
  },
  { type: 'cta' },
];
