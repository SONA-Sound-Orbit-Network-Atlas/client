# SONA - 3D 음악 생성 우주 탐험 플랫폼

<!-- 스크린샷 필요 -->

## 🚀 배포 링크

**Live Service**: [https://sona-sound.vercel.app/](https://sona-sound.vercel.app/)


## 시연 영상
https://github.com/user-attachments/assets/4a8f340f-de62-4446-bae1-55ad005040a0


## 📖 프로젝트 소개

SONA는 **3D 우주 공간에서 음악을 창작하고 탐험하는 혁신적인 플랫폼**입니다. 사용자는 가상의 우주에서 스텔라 시스템(Stellar System)을 만들고, 각 천체의 물리적 특성을 조정하여 독창적인 음악을 생성할 수 있습니다.

### 🎵 주요 기능

**🌌 3D 우주 탐험**

- 실시간 3D 렌더링으로 구현된 몰입감 있는 우주 환경
- 자유로운 카메라 시점 변경 및 궤도 탐험
- 아름다운 배경 별들과 우주 공간 시각화

**⭐ 스텔라 시스템 창작**

- 중심별(Star)과 행성(Planet)으로 구성된 나만의 스텔라 시스템 제작
- 각 천체의 크기, 색상, 궤도, 속도 등 물리적 특성 조정
- 실시간 미리보기로 변경사항 즉시 확인

**🎼 알고리즘 음악 생성**

- 천체의 특성이 음악적 매개변수로 자동 변환
- **6가지 악기** 지원: 베이스, 드럼, 패드, 멜로디, 아르페지오, 화음
- 각 천체가 고유한 음악적 역할을 담당하여 조화로운 앙상블 생성
- Tone.js 기반 실시간 오디오 합성

**👥 커뮤니티 기능**

- 다른 사용자들이 창작한 별자리 시스템 탐험
- 마음에 드는 작품에 좋아요 및 팔로우
- 개인 갤러리에서 나만의 작품 관리
- 작품 복제(Clone) 기능으로 리믹스 창작

**🎚️ 직관적인 제어 인터페이스**

- **INFO 탭**: 별자리 시스템 정보 및 관리
- **OBJECTS 탭**: 천체 추가/삭제 및 배치
- **PROPERTIES 탭**: 세밀한 음악적 매개변수 조정
- 실시간 오디오 플레이어로 즉시 재생 및 볼륨 조절

## ✨ 핵심 기술 (Tech Highlights)

- **React Three Fiber** - 3D 우주 환경 렌더링 및 인터랙션
- **Tone.js** - 실시간 음악 생성 및 오디오 처리 엔진
- **React Query** - 서버 상태 관리 및 데이터 캐싱
- **Zustand** - 클라이언트 상태 관리 (카메라, 선택된 객체 등)
- **Tailwind CSS** - 유틸리티 기반 스타일링 시스템
- **Framer Motion** - 부드러운 애니메이션 및 전환 효과
- **TypeScript** - 타입 안전성을 보장하는 정적 타입 검사
- **Vite** - 빠른 개발 서버 및 빌드 도구

## 📋 요구사항 (Requirements)

- **Node.js**: 18.0.0 이상
- **npm**: 9.0.0 이상 또는 **yarn**: 1.22.0 이상

## 🚀 Quick Start

### 1. 설치

```bash
# 저장소 클론
git clone https://github.com/SONA-Sound-Orbit-Network-Atlas/client.git
cd sona-project-front

# 의존성 설치
npm install
```

### 2. 환경변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# 환경변수 설정 (아래 환경변수 예시 참고)
```

### 3. 실행

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

## 🔧 환경변수 예시 (Env)

```env
# API 서버 URL
VITE_API_BASE_URL=https://api.example.com


## 📄 라이선스 (License)

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.
```
