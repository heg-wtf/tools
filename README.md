# 개발자 도구 모음 - Developer Tools Collection

개발자를 위한 필수 온라인 도구 모음입니다. UUID 생성기, JSON 포맷터, Base64 인코더, 해시 생성기, QR 코드 생성기, 색상 변환기, 부가세 계산기, 환율 변환기 등 다양한 유용한 도구를 무료로 제공합니다.

## 🚀 GitHub Pages 배포

이 프로젝트는 GitHub Pages를 통해 배포할 수 있도록 설정되어 있습니다.

### 배포 방법

1. **Repository Settings에서 Pages 설정**:
   - GitHub 저장소 → Settings → Pages
   - Source: "Deploy from a branch" 선택
   - Branch: `main` 선택
   - Folder: `/docs` 선택
   - Save 클릭

2. **자동 배포**:
   - `/docs` 디렉토리에 빌드된 정적 파일들이 포함되어 있습니다
   - 변경사항을 `main` 브랜치에 push하면 자동으로 배포됩니다

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드 (docs 폴더에 생성)
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 프로젝트 구조

```
├── src/                    # 소스 코드
│   ├── components/         # React 컴포넌트
│   │   ├── ui/            # UI 컴포넌트
│   │   └── ...            # 도구별 컴포넌트
│   ├── hooks/             # React hooks
│   ├── lib/               # 유틸리티 함수
│   └── ...
├── docs/                  # GitHub Pages 배포용 빌드 결과
│   ├── assets/            # CSS, JS 파일
│   ├── index.html         # 메인 페이지
│   ├── 404.html           # SPA 라우팅용 404 페이지
│   ├── .nojekyll          # Jekyll 비활성화
│   └── ...
└── ...
```

### 기술 스택

- **Frontend**: React 19, Vite 7
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## 📋 포함된 도구들

- UUID 생성기
- JSON 포맷터
- Base64 인코더/디코더
- 해시 생성기 (MD5, SHA1, SHA256)
- QR 코드 생성기
- 색상 변환기
- 부가세 계산기
- 환율 변환기
- 복리 계산기
- 대출 계산기
- 투자 수익률 계산기
- 소득세 계산기
- UTC 시간 변환기
- Unix Timestamp 변환기
- MySQL 암호 생성기
- 주소 위경도 변환기

## 🔧 설정

GitHub Pages 배포를 위해 다음 설정이 적용되어 있습니다:

- **Base Path**: `/tools/` (vite.config.js에서 설정)
- **Build Output**: `/docs` 디렉토리
- **SPA Routing**: 404.html을 통한 클라이언트 사이드 라우팅 지원
- **Jekyll 비활성화**: .nojekyll 파일 포함

## 📝 라이선스

MIT License