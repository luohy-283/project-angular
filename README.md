# Claim Management Admin Portal

Project thực hành Angular — khóa đào tạo 2 tuần.

Ứng dụng **Claim Management Admin Portal** là portal quản trị hồ sơ bồi thường dạng mock, gồm đăng nhập theo role, dashboard tổng quan, CRUD hồ sơ (lưu localStorage), tìm kiếm/lọc/phân trang, và danh sách người dùng từ public API có fallback JSON.

## Công nghệ sử dụng

- Angular 19 (standalone components)
- TypeScript strict mode
- Angular Material
- RxJS, Angular Signals
- HttpClient, functional guard/interceptor
- Karma + Jasmine (unit test)
- ESLint, Prettier

## Yêu cầu môi trường và cài đặt

- Node.js 18 trở lên
- npm 9 trở lên

Cài đặt dependency:

```bash
npm install
```

## Cách chạy

```bash
# Dev server (mặc định http://localhost:4200)
npm start
# hoặc: ng serve

# Build production
npm run build
# hoặc: ng build

# Unit test (chạy một lần, headless)
npm test -- --watch=false --browsers=ChromeHeadless
# hoặc: ng test --watch=false --browsers=ChromeHeadless
```

## Tài khoản login mock

| Username | Password | Role | Ghi chú |
|----------|----------|------|---------|
| `admin` | `admin` | ADMIN | Thấy đủ menu, truy cập được Users |
| `user` | `user` | USER | Menu Users bị ẩn, vào `/users` sẽ bị chuyển 403 |

## Danh sách màn hình

| Màn hình | Route | Mô tả |
|----------|-------|-------|
| Login | `/login` | Đăng nhập mock |
| Dashboard | `/dashboard` | Tổng quan số liệu hồ sơ |
| Claim List | `/claims` | Danh sách, search, filter, paging |
| Claim Detail | `/claims/:id` | Xem chi tiết hồ sơ |
| Claim Create | `/claims/create` | Tạo hồ sơ mới |
| Claim Edit | `/claims/:id/edit` | Sửa hồ sơ |
| User List | `/users` | Danh sách user (chỉ ADMIN) |
| Forbidden | `/403` | Trang lỗi không đủ quyền |
| Not Found | `/**` | Trang 404 |

## API và mock data

| Nguồn | Dùng cho | Ghi chú |
|-------|----------|---------|
| `assets/mock-data/dashboard.json` | Dashboard | Đọc qua `DashboardService` |
| `assets/mock-data/claims.json` | Claims seed | Lần đầu load vào `localStorage`; CRUD sau đó thao tác trên `localStorage`, **không ghi ngược** file JSON tĩnh |
| `https://jsonplaceholder.typicode.com/users` | User List | Gọi qua `UserService`, map qua `user.adapter.ts` |
| `assets/mock-data/users.json` | User List fallback | Dùng khi public API lỗi |

## Ngày 1 — Setup project

### Đã hoàn thành

- Khởi tạo project Angular bằng Angular CLI
- Bật TypeScript strict mode
- Cài đặt Angular Material
- Tạo cấu trúc thư mục: `core`, `shared`, `features`, `layouts`
- Cấu hình ESLint và Prettier
- Khởi tạo Git repository

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

## Ngày 5 — Reactive Forms, detail page và CRUD mock

### Đã hoàn thành

- Tạo form chung cho tạo/sửa hồ sơ bồi thường bằng Reactive Forms
- Validate bắt buộc cho các field chính như số hồ sơ, tên khách hàng, số hợp đồng, loại hồ sơ, cơ sở khám chữa bệnh, ngày nhận hồ sơ, số tiền yêu cầu và số tiền duyệt
- Thêm validation nghiệp vụ để ngăn số tiền duyệt lớn hơn số tiền yêu cầu
- Hoàn thiện trang chi tiết hồ sơ với dữ liệu từ ClaimService
- Thêm nút sửa/xóa hồ sơ và dialog xác nhận trước khi xóa hoặc hủy thao tác
- CRUD mock qua localStorage để giữ dữ liệu giữa các lần reload mà không cần backend thật
- Bổ sung phân trang cho claims list bằng reusable PaginationComponent và ClaimService giả lập server-side pagination từ localStorage

### Nội dung chính

- ClaimFormComponent
- ConfirmDialogComponent
- ClaimCreateComponent và ClaimEditComponent container mỏng
- ClaimDetailComponent với flow xóa hồ sơ
- ClaimService lưu dữ liệu vào localStorage sau lần đọc đầu tiên từ JSON mock

## Ngày 6 — Public API, Adapter và fallback JSON

### Đã hoàn thành

- Gọi public API từ JSONPlaceholder cho danh sách users
- Tạo model raw response cho PublicUser và view model AppUser
- Tách adapter pure function để map PublicUser sang AppUser
- Dùng fallback từ file JSON mock khi API thật lỗi
- Users list render từ service qua adapter, không nhận raw response trực tiếp trong component

## Ngày 7 — Mock Authentication, Guard, Interceptor và Role-based Menu

### Đã hoàn thành

- Tạo mock auth flow với tài khoản admin/user
- Tạo LoginComponent với Reactive Forms và mat-error
- Tạo AuthService lưu token và current user trong localStorage
- Tạo authGuard và roleGuard theo chuẩn functional Angular 19
- Tạo authInterceptor gắn Authorization header cho mọi request
- Tạo ForbiddenComponent cho route 403
- Sidebar hiển thị menu theo role hiện tại và Logout ở header

## Ngày 8 — Search, Filter, Paging, RxJS và Signals

### Đã hoàn thành

- Tạo Signal để quản lý UI state: keyword, status, type, pageIndex, pageSize, loading, claims, total, error
- Tạo method mới getClaimsList() trong ClaimService để xử lý search/filter/paging (không đổi getClaims() cũ)
- Dùng RxJS pipe: toObservable → debounceTime(300) → distinctUntilChanged → switchMap
- Áp dụng debounceTime chỉ cho keyword (search), không áp dụng cho filter/paging
- 1 ô input search chung match OR trên soHoSo và tenKhachHang (case-insensitive)
- 2 mat-select filter cho trạng thái hồ sơ và loại hồ sơ, có option "Tất cả" để bỏ filter
- Reuse PaginationComponent hiện có cho phân trang
- Hiển thị loading, error, empty state tương ứng
- Sau Create/Edit/Delete quay lại /claims, danh sách reset về trang 1 không keyword không filter

## Các lệnh hữu ích khác

| Lệnh | Mô tả |
|------|-------|
| `npm run lint` | Kiểm tra ESLint |
| `npm run format` | Format code bằng Prettier |


## Ngày 9

- Đã kiểm tra Claims lazy loading: route `/claims` dùng `loadChildren`, build có lazy chunk `claims-component`.
- Không áp dụng `@defer` vì Dashboard chỉ có 4 card và Claims list đã paging 10 item, chưa có block render nặng phù hợp.
- Đã bổ sung unit test cơ bản cho `ClaimService`, `authGuard`, `LoginComponent` và cập nhật assertion `AppComponent` theo template hiện tại.
- `ng test --watch=false --browsers=ChromeHeadless`: 12 specs pass.
- `ng build`: production build thành công; còn warning budget initial vượt 26.82 kB.

## Ngày 10 — Final review, cleanup, README và chuẩn bị demo

- Rà soát codebase: không còn `console.log`, `debugger`, comment debug hay TODO cũ.
- Sửa các lỗi ESLint (`Array<T>` → `T[]`, `inject()` thay constructor injection ở `ConfirmDialogComponent`).
- Hoàn thiện README: giới thiệu, công nghệ, hướng dẫn chạy, tài khoản mock, danh sách màn hình, API/mock data, demo checklist.
- Xác nhận routing, `ng build`, `ng test` pass; không thay đổi flow nghiệp vụ Ngày 1–9.

## Demo checklist

Dùng checklist sau khi demo thủ công trên UI:

- [ ] Login với tài khoản ADMIN
- [ ] Login với tài khoản USER
- [ ] Chưa login truy cập route bảo vệ bị chặn (AuthGuard)
- [ ] Dashboard hiển thị số liệu tổng quan
- [ ] Claim List: hiển thị danh sách
- [ ] Search theo số hồ sơ / tên khách hàng
- [ ] Filter theo trạng thái hồ sơ
- [ ] Filter theo loại hồ sơ
- [ ] Paging hoạt động
- [ ] Xem chi tiết hồ sơ (Claim Detail)
- [ ] Tạo hồ sơ mới (Claim Create)
- [ ] Sửa hồ sơ (Claim Edit)
- [ ] Xóa hồ sơ (có confirm dialog)
- [ ] Loading / Error / Empty state hiển thị đúng lúc
- [ ] User List lấy từ public API, có fallback khi API lỗi
- [ ] Menu thay đổi theo role (ADMIN thấy đủ, USER bị ẩn bớt)
- [ ] Truy cập route không đủ quyền → chuyển tới trang 403 (RoleGuard)
- [ ] Truy cập route không tồn tại → trang 404
- [ ] Logout xóa token, quay về Login


## Cấu trúc source code


```
project-angular
├─ .agents                          # cấu hình agent AI (Cursor/Codex) cho repo
├─ .angular                         # cache build của Angular CLI, tự sinh
├─ .editorconfig                    # quy ước format chung cho các editor
├─ .prettierignore                  # danh sách file Prettier bỏ qua khi format
├─ .prettierrc                      # cấu hình quy tắc format Prettier
├─ angular.json                     # cấu hình project Angular CLI (build, serve, test)
├─ eslint.config.js                 # cấu hình rule lint
├─ package-lock.json                # khóa version chính xác của dependency
├─ package.json                     # danh sách dependency, script npm
├─ public
│  └─ favicon.ico                   # icon tab trình duyệt
├─ README.md                        # tài liệu mô tả project
├─ src
│  ├─ app
│  │  ├─ app.component.html         # template gốc, chỉ chứa router-outlet
│  │  ├─ app.component.scss         # style cho app.component
│  │  ├─ app.component.spec.ts      # unit test app.component
│  │  ├─ app.component.ts           # component gốc của toàn app
│  │  ├─ app.config.ts              # khai báo provider toàn cục (router, http, interceptor)
│  │  ├─ app.routes.ts              # bảng route gốc, trỏ tới AdminLayout/Login/404
│  │  ├─ core
│  │  │  ├─ adapters
│  │  │  │  └─ user.adapter.ts      # map raw API user → AppUser (view model)
│  │  │  ├─ guards
│  │  │  │  ├─ auth.guard.spec.ts   # test authGuard
│  │  │  │  ├─ auth.guard.ts        # chặn route nếu chưa login
│  │  │  │  └─ role.guard.ts        # chặn route nếu sai role
│  │  │  ├─ interceptors
│  │  │  │  └─ auth.interceptor.ts  # tự gắn Authorization token vào mọi request
│  │  │  ├─ models
│  │  │  │  ├─ app-user.model.ts    # interface AppUser (view model)
│  │  │  │  ├─ claim.model.ts       # interface Claim, ClaimQueryParams, ClaimListResult
│  │  │  │  ├─ dashboard.model.ts   # interface dữ liệu dashboard
│  │  │  │  └─ public-user.model.ts # interface raw response từ JSONPlaceholder
│  │  │  └─ services
│  │  │     ├─ auth.service.ts      # login/logout, lưu token, đọc role hiện tại
│  │  │     ├─ claim.service.spec.ts# test ClaimService
│  │  │     ├─ claim.service.ts     # CRUD hồ sơ, search/filter/paging
│  │  │     ├─ dashboard.service.ts # lấy số liệu tổng quan dashboard
│  │  │     └─ user.service.ts      # gọi public API, map qua adapter, fallback JSON
│  │  ├─ features
│  │  │  ├─ auth
│  │  │  │  └─ login
│  │  │  │     ├─ login.component.html   # form đăng nhập
│  │  │  │     ├─ login.component.scss   # style trang login
│  │  │  │     ├─ login.component.spec.ts# test LoginComponent
│  │  │  │     └─ login.component.ts     # logic submit login, redirect
│  │  │  ├─ claims
│  │  │  │  ├─ claim-create
│  │  │  │  │  ├─ claim-create.component.html # màn tạo hồ sơ mới
│  │  │  │  │  ├─ claim-create.component.scss
│  │  │  │  │  └─ claim-create.component.ts   # gọi ClaimFormComponent, xử lý tạo mới
│  │  │  │  ├─ claim-detail
│  │  │  │  │  ├─ claim-detail.component.html # xem chi tiết hồ sơ
│  │  │  │  │  ├─ claim-detail.component.scss
│  │  │  │  │  └─ claim-detail.component.ts   # load claim theo id, hiển thị
│  │  │  │  ├─ claim-edit
│  │  │  │  │  ├─ claim-edit.component.html   # màn sửa hồ sơ
│  │  │  │  │  ├─ claim-edit.component.scss
│  │  │  │  │  └─ claim-edit.component.ts     # load claim, patch form, submit update
│  │  │  │  ├─ claim-form
│  │  │  │  │  ├─ claim-form.component.html   # form dùng chung create/edit
│  │  │  │  │  ├─ claim-form.component.scss
│  │  │  │  │  └─ claim-form.component.ts     # Reactive Form + validation
│  │  │  │  ├─ claims.component.html          # bảng danh sách hồ sơ
│  │  │  │  ├─ claims.component.scss
│  │  │  │  ├─ claims.component.ts            # search/filter/paging, Signals, gọi ClaimService
│  │  │  │  └─ claims.routes.ts               # route con của feature claims (lazy load)
│  │  │  ├─ dashboard
│  │  │  │  ├─ dashboard.component.html       # hiển thị card tổng quan
│  │  │  │  ├─ dashboard.component.scss
│  │  │  │  └─ dashboard.component.ts         # gọi DashboardService, render số liệu
│  │  │  ├─ forbidden
│  │  │  │  ├─ forbidden.component.html       # trang 403
│  │  │  │  ├─ forbidden.component.scss
│  │  │  │  └─ forbidden.component.ts
│  │  │  ├─ not-found
│  │  │  │  ├─ not-found.component.html       # trang 404
│  │  │  │  ├─ not-found.component.scss
│  │  │  │  └─ not-found.component.ts
│  │  │  └─ users
│  │  │     ├─ users.component.html           # danh sách user từ public API
│  │  │     ├─ users.component.scss
│  │  │     └─ users.component.ts             # gọi UserService, render danh sách
│  │  ├─ layouts
│  │  │  └─ admin-layout
│  │  │     ├─ admin-layout.component.html    # khung layout: header + sidebar + content
│  │  │     ├─ admin-layout.component.scss
│  │  │     ├─ admin-layout.component.ts
│  │  │     ├─ header
│  │  │     │  ├─ header.component.html       # thanh header, hiển thị user + logout
│  │  │     │  ├─ header.component.scss
│  │  │     │  └─ header.component.ts
│  │  │     └─ sidebar
│  │  │        ├─ sidebar.component.html      # menu điều hướng, lọc theo role
│  │  │        ├─ sidebar.component.scss
│  │  │        └─ sidebar.component.ts
│  │  └─ shared
│  │     ├─ components
│  │     │  ├─ confirm-dialog
│  │     │  │  ├─ confirm-dialog.component.html # dialog xác nhận xóa/hủy
│  │     │  │  ├─ confirm-dialog.component.scss
│  │     │  │  └─ confirm-dialog.component.ts
│  │     │  ├─ empty-state
│  │     │  │  ├─ empty-state.component.html   # hiển thị khi danh sách rỗng
│  │     │  │  ├─ empty-state.component.scss
│  │     │  │  └─ empty-state.component.ts
│  │     │  ├─ loading
│  │     │  │  ├─ loading.component.html       # spinner loading dùng chung
│  │     │  │  ├─ loading.component.scss
│  │     │  │  └─ loading.component.ts
│  │     │  ├─ page-title
│  │     │  │  ├─ page-title.component.html    # tiêu đề trang dùng chung
│  │     │  │  ├─ page-title.component.scss
│  │     │  │  └─ page-title.component.ts
│  │     │  ├─ pagination
│  │     │  │  ├─ pagination.component.html    # component phân trang tái sử dụng
│  │     │  │  ├─ pagination.component.scss
│  │     │  │  └─ pagination.component.ts
│  │     │  └─ status-badge
│  │     │     ├─ status-badge.component.html  # badge hiển thị trạng thái hồ sơ
│  │     │     ├─ status-badge.component.scss
│  │     │     └─ status-badge.component.ts
│  │     └─ constants
│  │        └─ menu.const.ts                   # danh sách menu item cho sidebar
│  ├─ assets
│  │  └─ mock-data
│  │     ├─ claims.json             # dữ liệu seed hồ sơ ban đầu
│  │     ├─ dashboard.json          # dữ liệu seed dashboard
│  │     └─ users.json              # dữ liệu seed user, fallback khi public API lỗi
│  ├─ index.html                    # HTML gốc, nơi Angular bootstrap vào
│  ├─ main.ts                       # entry point, bootstrapApplication
│  └─ styles.scss                   # style global toàn app
├─ tsconfig.app.json                # cấu hình TypeScript cho app
├─ tsconfig.json                    # cấu hình TypeScript gốc
└─ tsconfig.spec.json               # cấu hình TypeScript cho test

```
