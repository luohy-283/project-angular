# Claim Management Admin Portal

Project thực hành Angular — khóa đào tạo 2 tuần.

## Ngày 1 — Setup project

### Đã hoàn thành

- Khởi tạo project Angular bằng Angular CLI
- Bật TypeScript strict mode
- Cài đặt Angular Material
- Tạo cấu trúc thư mục: `core`, `shared`, `features`, `layouts`
- Cấu hình ESLint và Prettier
- Khởi tạo Git repository

### Công nghệ

- Angular 19 (standalone components)
- TypeScript strict mode
- Angular Material
- ESLint, Prettier

## Yêu cầu môi trường

- Node.js 18 trở lên
- npm 9 trở lên

## Cài đặt và chạy

```bash
npm install
npm start
```

Mở trình duyệt tại [http://localhost:4200](http://localhost:4200).

## Các lệnh hữu ích

| Lệnh | Mô tả |
|------|-------|
| `npm run build` | Build production |
| `npm run lint` | Kiểm tra ESLint |
| `npm run format` | Format code bằng Prettier |
| `npm test` | Chạy unit test |

## Cấu trúc source code

```
project-angular
├─ .angular
├─ .editorconfig
├─ .prettierignore
├─ .prettierrc
├─ angular.json
├─ eslint.config.js
├─ package-lock.json
├─ package.json
├─ public
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ app
│  │  ├─ app.component.html
│  │  ├─ app.component.scss
│  │  ├─ app.component.spec.ts
│  │  ├─ app.component.ts
│  │  ├─ app.config.ts
│  │  ├─ app.routes.ts
│  │  ├─ core
│  │  ├─ features
│  │  ├─ layouts
│  │  └─ shared
│  ├─ index.html
│  ├─ main.ts
│  └─ styles.scss
├─ tsconfig.app.json
├─ tsconfig.json
└─ tsconfig.spec.json

```