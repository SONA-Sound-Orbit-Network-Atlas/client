// 섹션 데이터 정의
export const SECTIONS = [
  {
    id: 'section1',
    title: 'SECTION 1 – 은하뷰 소개',
    content: '탐험 가능한 은하의 첫 인상',
  },
  {
    id: 'section2',
    title: 'SECTION 2 – 행성뷰 소개',
    content: '행성 특성 변경',
  },
  {
    id: 'section3',
    title: 'SECTION 3 – 컬렉션',
    content: '다양한 행성들을 한데 모으기',
  },
  {
    id: 'section4',
    title: 'SECTION 4 – 모두 하나',
    content: '하나의 우주로 연결되는 느낌',
  },
  {
    id: 'section5',
    title: 'SECTION 5 – 팀 소개',
    content: 'GitHub / Email hover → copy',
  },
];

export default function SectionWrap() {
  return (
    <>
      {SECTIONS.map((section, index) => (
        <section key={section.id} className={`section ${section.id}`}>
          <h1>{section.title}</h1>
          <p>{section.content}</p>
        </section>
      ))}
    </>
  );
}
