# Developer Tools Collection Makefile
# 개발자 도구 모음 빌드 및 배포 자동화

.PHONY: help install dev build clean preview lint test deploy

# 기본 목표
help: ## 사용 가능한 명령어 목록 표시
	@echo "사용 가능한 명령어:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## 의존성 설치
	@echo "📦 의존성 설치 중..."
	npm install
	@echo "✅ 의존성 설치 완료!"

dev: ## 개발 서버 실행
	@echo "🚀 개발 서버 시작 중..."
	npm run dev

build: ## 프로덕션 빌드 생성
	@echo "🔨 프로덕션 빌드 생성 중..."
	npm run build
	@echo "✅ 빌드 완료! docs/ 폴더를 확인하세요."

build-local: ## 로컬용 빌드 생성 (base path = /)
	@echo "🔨 로컬용 빌드 생성 중..."
	npm run build:local
	@echo "✅ 로컬용 빌드 완료!"

clean: ## 빌드 파일 및 node_modules 정리
	@echo "🧹 빌드 파일 정리 중..."
	rm -rf docs/assets/
	rm -f docs/index.html
	rm -rf dist/
	@echo "✅ 빌드 파일 정리 완료!"

clean-all: clean ## 모든 파일 정리 (node_modules 포함)
	@echo "🧹 모든 파일 정리 중..."
	rm -rf node_modules/
	rm -f package-lock.json
	@echo "✅ 전체 정리 완료!"

preview: build ## 빌드 결과 미리보기
	@echo "👀 빌드 결과 미리보기..."
	npm run preview

lint: ## 코드 린팅 실행
	@echo "🔍 코드 린팅 실행 중..."
	@if command -v eslint >/dev/null 2>&1; then \
		npx eslint src/ --ext .js,.jsx; \
	else \
		echo "⚠️  ESLint가 설치되지 않았습니다. 설치하려면: npm install -D eslint"; \
	fi

format: ## 코드 포맷팅 (Prettier)
	@echo "✨ 코드 포맷팅 실행 중..."
	@if command -v prettier >/dev/null 2>&1; then \
		npx prettier --write src/; \
	else \
		echo "⚠️  Prettier가 설치되지 않았습니다. 설치하려면: npm install -D prettier"; \
	fi

test: ## 테스트 실행
	@echo "🧪 테스트 실행 중..."
	npm test

# 배포 관련 명령어
deploy-check: build ## 배포 전 검증
	@echo "🔍 배포 전 검증 중..."
	@if [ ! -f docs/index.html ]; then \
		echo "❌ 빌드 파일이 없습니다. 먼저 'make build'를 실행하세요."; \
		exit 1; \
	fi
	@echo "✅ 배포 준비 완료!"

deploy: deploy-check ## GitHub Pages 배포 (수동)
	@echo "🚀 배포 준비 완료!"
	@echo "GitHub Pages 배포 방법:"
	@echo "1. git add docs/"
	@echo "2. git commit -m '🚀 Deploy: Update build'"
	@echo "3. git push origin main"

# 개발 관련 유틸리티
watch: ## 파일 변경 감지하여 자동 빌드
	@echo "👀 파일 변경 감지 모드..."
	@while true; do \
		make build; \
		echo "⏳ 파일 변경을 기다리는 중... (Ctrl+C로 종료)"; \
		sleep 5; \
	done

stats: ## 프로젝트 통계 정보
	@echo "📊 프로젝트 통계:"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "📁 총 파일 수: $$(find src/ -type f | wc -l | tr -d ' ')"
	@echo "📝 JS/JSX 파일: $$(find src/ -name '*.js' -o -name '*.jsx' | wc -l | tr -d ' ')"
	@echo "🎨 CSS 파일: $$(find src/ -name '*.css' | wc -l | tr -d ' ')"
	@echo "📦 컴포넌트 수: $$(find src/components/ -name '*.jsx' | wc -l | tr -d ' ')"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@if [ -f docs/index.html ]; then \
		echo "📦 빌드 상태: ✅ 완료"; \
		echo "📊 빌드 크기: $$(du -sh docs/ | cut -f1)"; \
	else \
		echo "📦 빌드 상태: ❌ 미완료"; \
	fi

# 빠른 명령어 별칭
b: build ## build의 단축 명령어
d: dev ## dev의 단축 명령어
c: clean ## clean의 단축 명령어
i: install ## install의 단축 명령어

# Git 관련 유틸리티
commit-build: build ## 빌드 후 자동 커밋
	@echo "📝 빌드 결과 커밋 중..."
	git add docs/
	git commit -m "🚀 Build: Update production build"
	@echo "✅ 빌드 커밋 완료!"

# 기본 목표 설정
.DEFAULT_GOAL := help
