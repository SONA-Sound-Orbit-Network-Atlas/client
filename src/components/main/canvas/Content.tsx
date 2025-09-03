import { Block } from '../blocks/Block';

export default function Content() {
  return (
    <>
      {/* Section 1: 3D 객체용 (현재는 비어있음) */}
      <Block factor={1} offset={0}>
        <group />
      </Block>

      {/* Section 2: 3D 객체용 */}
      <Block factor={1} offset={1}>
        <group />
      </Block>

      {/* Section 3: 3D 객체용 */}
      <Block factor={1} offset={2}>
        <group />
      </Block>

      {/* Section 4: 3D 객체용 */}
      <Block factor={1} offset={3}>
        <group />
      </Block>
    </>
  );
}
