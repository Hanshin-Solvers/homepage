# Solvers Homepage

알고리즘 소모임 Solvers의 공식 홈페이지입니다.

## 개발

```bash
npm install
npm run dev
```

로컬 주소는 `http://localhost:4321/homepage/`입니다.

## 콘텐츠 수정

홈페이지 문구와 데이터는 `src/content` 아래의 Markdown 파일에서 관리합니다.

```text
src/content/
├── home/index.md
├── about/index.md
├── join/index.md
├── studies/index.md
├── contests/2026-fall.md
├── members/
└── competitions/
```

Markdown을 수정하고 `main` 브랜치에 반영하면 GitHub Actions가 검사·빌드·배포를 진행합니다.

## 검사와 빌드

```bash
npm run check:content
npm run build
```
