import React from 'react';

type TextProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

export function Text({ children, style, className }: TextProps) {
  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
}

// 특정 스타일을 가진 텍스트 컴포넌트들
export function TitleText({ children, ...props }: TextProps) {
  return (
    <Text
      {...props}
      style={{
        color: '#eaeaea',
        fontSize: 'min(8vw, 140px)',
        fontWeight: 800,
        lineHeight: 1.06,
        letterSpacing: '-0.02em',
        opacity: 1,
        transition: 'opacity 0.3s ease',
        ...props.style,
      }}
    >
      {children}
    </Text>
  );
}

export function SectionText({ children, ...props }: TextProps) {
  return (
    <Text
      {...props}
      style={{
        margin: 0,
        color: '#fff',
        fontSize: 'clamp(28px, 4vw, 56px)',
        ...props.style,
      }}
    >
      {children}
    </Text>
  );
}

export function BodyText({ children, ...props }: TextProps) {
  return (
    <Text
      {...props}
      style={{
        marginTop: 12,
        color: '#c9ced8',
        fontSize: 'clamp(16px, 1.6vw, 22px)',
        lineHeight: 1.7,
        maxWidth: 720,
        ...props.style,
      }}
    >
      {children}
    </Text>
  );
}
