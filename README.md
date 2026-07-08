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

## Ngày 2 — Admin Layout và shared components

### Đã hoàn thành

- Tạo menu mock cho sidebar
- Tạo shared components: PageTitle, Loading, EmptyState, StatusBadge
- Tạo layout admin gồm Header, Sidebar, Content Area
- Tạo placeholder pages cho Dashboard, Claims, Users
- Render layout admin từ AppComponent

### Nội dung chính

- Admin Layout
- Header
- Sidebar
- Shared Components
- Menu Mock
- Dashboard/Claims/Users Placeholder

## Ngày 3 — Routing và lazy loading

### Đã hoàn thành

- Cấu hình routing cho layout admin và các placeholder page
- Tạo lazy loaded claims routes
- Tạo placeholder pages cho create/detail/edit claims
- Tạo 404 page
- Thêm ví dụ Angular control flow bằng @if, @for và @switch

### Nội dung chính

- Routing
- Lazy Loading
- Claims Routes
- 404 Page
- Angular Control Flow

## Day 4

- Thêm mock data từ file JSON cho dashboard và claim list
- Tạo service cho dashboard và claims
- Hiển thị dashboard cards bằng Angular Material
- Hiển thị claim list bằng table thuần
- Có loading, error và empty state cơ bản

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
│  │  │  ├─ models
│  │  │  │  ├─ claim.model.ts
│  │  │  │  └─ dashboard.model.ts
│  │  │  └─ services
│  │  │     ├─ claim.service.ts
│  │  │     └─ dashboard.service.ts
│  │  ├─ features
│  │  │  ├─ claims
│  │  │  │  ├─ claim-create
│  │  │  │  │  ├─ claim-create.component.html
│  │  │  │  │  ├─ claim-create.component.scss
│  │  │  │  │  └─ claim-create.component.ts
│  │  │  │  ├─ claim-detail
│  │  │  │  │  ├─ claim-detail.component.html
│  │  │  │  │  ├─ claim-detail.component.scss
│  │  │  │  │  └─ claim-detail.component.ts
│  │  │  │  ├─ claim-edit
│  │  │  │  │  ├─ claim-edit.component.html
│  │  │  │  │  ├─ claim-edit.component.scss
│  │  │  │  │  └─ claim-edit.component.ts
│  │  │  │  ├─ claims.component.html
│  │  │  │  ├─ claims.component.scss
│  │  │  │  ├─ claims.component.ts
│  │  │  │  └─ claims.routes.ts
│  │  │  ├─ dashboard
│  │  │  │  ├─ dashboard.component.html
│  │  │  │  ├─ dashboard.component.scss
│  │  │  │  └─ dashboard.component.ts
│  │  │  ├─ not-found
│  │  │  │  ├─ not-found.component.html
│  │  │  │  ├─ not-found.component.scss
│  │  │  │  └─ not-found.component.ts
│  │  │  └─ users
│  │  │     ├─ users.component.html
│  │  │     ├─ users.component.scss
│  │  │     └─ users.component.ts
│  │  ├─ layouts
│  │  │  └─ admin-layout
│  │  │     ├─ admin-layout.component.html
│  │  │     ├─ admin-layout.component.scss
│  │  │     ├─ admin-layout.component.ts
│  │  │     ├─ header
│  │  │     │  ├─ header.component.html
│  │  │     │  ├─ header.component.scss
│  │  │     │  └─ header.component.ts
│  │  │     └─ sidebar
│  │  │        ├─ sidebar.component.html
│  │  │        ├─ sidebar.component.scss
│  │  │        └─ sidebar.component.ts
│  │  └─ shared
│  │     ├─ components
│  │     │  ├─ empty-state
│  │     │  │  ├─ empty-state.component.html
│  │     │  │  ├─ empty-state.component.scss
│  │     │  │  └─ empty-state.component.ts
│  │     │  ├─ loading
│  │     │  │  ├─ loading.component.html
│  │     │  │  ├─ loading.component.scss
│  │     │  │  └─ loading.component.ts
│  │     │  ├─ page-title
│  │     │  │  ├─ page-title.component.html
│  │     │  │  ├─ page-title.component.scss
│  │     │  │  └─ page-title.component.ts
│  │     │  └─ status-badge
│  │     │     ├─ status-badge.component.html
│  │     │     ├─ status-badge.component.scss
│  │     │     └─ status-badge.component.ts
│  │     └─ constants
│  │        └─ menu.const.ts
│  ├─ assets
│  │  └─ mock-data
│  │     ├─ claims.json
│  │     └─ dashboard.json
│  ├─ index.html
│  ├─ main.ts
│  └─ styles.scss
├─ tsconfig.app.json
├─ tsconfig.json
└─ tsconfig.spec.json

```