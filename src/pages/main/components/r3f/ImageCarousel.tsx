import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, useScroll } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import { imageCarouselData } from '../../../../data/ImageCarousel_info';
import '../../../../utils/threeUtils.js';

// bentPlaneGeometry 타입 선언
declare global {
  namespace JSX {
    interface IntrinsicElements {
      bentPlaneGeometry: any;
    }
  }
}

interface CardProps {
  imageInfo: any;
  position: [number, number, number];
  rotation: [number, number, number];
}

function Card({ imageInfo, ...props }: CardProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);

  const pointerOver = (e: any) => {
    e.stopPropagation();
    hover(true);
  };

  const pointerOut = () => hover(false);

  useFrame((_state, delta) => {
    if (ref.current) {
      // 호버 시 살짝 확대
      easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);

      // 재질 효과 (radius, zoom)
      if (ref.current.material && 'radius' in ref.current.material) {
        const material = ref.current.material as Record<string, any>;
        easing.damp(material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta);
        easing.damp(material, 'zoom', hovered ? 1 : 1.5, 0.2, delta);
      }
    }
  });

  return (
    <group>
      <Image
        ref={ref}
        url={imageInfo.image}
        transparent
        side={THREE.DoubleSide}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
        {...props}
      >
        <bentPlaneGeometry args={[0.1, 2, 2, 20, 20]} />
      </Image>
    </group>
  );
}

interface CarouselProps {
  radius?: number;
}

function Carousel({ radius = 2.5 }: CarouselProps) {
  const count = imageCarouselData.length;

  return (
    <>
      {imageCarouselData.map((imageInfo, i) => (
        <Card
          key={imageInfo.id}
          imageInfo={imageInfo}
          position={[
            Math.sin((i / count) * Math.PI * 2) * radius,
            0,
            Math.cos((i / count) * Math.PI * 2) * radius,
          ]}
          rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
        />
      ))}
    </>
  );
}

interface RigProps {
  children: React.ReactNode;
  rotation?: [number, number, number];
}

function Rig({ children, zoom, ...props }: RigProps & { zoom: number }) {
  const ref = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (ref.current && scroll) {
      // ScrollControls의 offset을 사용한 부드러운 회전
      ref.current.rotation.y = -scroll.offset * (Math.PI * 2);
      state.events?.update();

      // 마우스 위치와 줌을 반영한 카메라 위치
      easing.damp3(
        state.camera.position,
        [-state.pointer.x * 2, state.pointer.y + 1.5, zoom],
        0.3,
        delta
      );
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  );
}

interface ImageCarouselProps {
  zoom: number;
}

export default function ImageCarousel({ zoom }: ImageCarouselProps) {
  return (
    <Rig rotation={[0, 0, 0.15]} zoom={zoom}>
      <Carousel />
    </Rig>
  );
}
