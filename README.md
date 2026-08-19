# MEAN Skeleton — Auth JWT + Master-Detail CRUD (Angular 18)

Skeleton aplikasi MEAN stack (MongoDB, Express, Angular, Node.js) dengan:

- Autentikasi JWT (register, login, `me`, route guard)
- CRUD penuh untuk resource `Item`
- Layout master-detail di frontend (daftar item di kiri, form detail di kanan)
- Styling Tailwind CSS

## Struktur folder

```
mean-skeleton/
├── server/          # Express + MongoDB (Mongoose) + JWT
│   └── src/
│       ├── config/db.js
│       ├── models/User.js
│       ├── models/Item.js
│       ├── middleware/auth.js
│       ├── controllers/authController.js
│       ├── controllers/itemController.js
│       ├── routes/authRoutes.js
│       ├── routes/itemRoutes.js
│       └── index.js
└── client/           # Angular 18 (standalone) + Tailwind CSS
    └── src/
        ├── environments/          # apiUrl dev & prod
        └── app/
            ├── core/
            │   ├── models/models.ts
            │   ├── services/auth.service.ts
            │   ├── services/item.service.ts
            │   ├── interceptors/auth.interceptor.ts
            │   └── guards/auth.guard.ts
            ├── components/ (layout, item-list, item-detail)
            ├── pages/ (login, register, dashboard)
            ├── app.component.ts
            ├── app.config.ts
            └── app.routes.ts
```

## Menjalankan backend

```bash
cd server
cp .env.example .env   # sesuaikan MONGO_URI dan JWT_SECRET
npm install
npm run dev            # butuh nodemon, atau pakai: npm start
```

Backend berjalan di `http://localhost:5000`, pastikan MongoDB (lokal atau Atlas) sudah aktif dan `MONGO_URI` di `.env` sudah benar.

## Menjalankan frontend (Angular)

```bash
cd client
npm install
npm start        # sama dengan: ng serve
```

Frontend berjalan di `http://localhost:4200`. URL API diatur di `src/environments/environment.ts` (default `http://localhost:5000/api`).

> Catatan: project ini dibuat manual mengikuti struktur `ng new` standar (standalone components, tanpa NgModule). Setelah `npm install`, semua tooling Angular CLI (`ng serve`, `ng build`) akan berjalan normal seperti project hasil `ng new`.

## Konsep Angular yang dipakai

| Bagian React (sebelumnya)         | Padanan di Angular                                        |
| --------------------------------- | --------------------------------------------------------- |
| `AuthContext` + `useAuth()`       | `AuthService` (state via Angular `signal`)                |
| axios instance + interceptor      | `HttpClient` + `authInterceptor` (functional interceptor) |
| `PrivateRoute`                    | `authGuard` (functional `CanActivateFn`)                  |
| `ItemList`, `ItemDetail`          | `ItemListComponent`, `ItemDetailComponent` (standalone)   |
| React Router (`react-router-dom`) | Angular Router dengan lazy-loaded standalone components   |
| `useState` form                   | `ReactiveFormsModule` (`FormGroup`, `FormBuilder`)        |

## Endpoint API

| Method | Endpoint           | Keterangan                                    | Auth |
| ------ | ------------------ | --------------------------------------------- | ---- |
| POST   | /api/auth/register | Registrasi user baru                          | -    |
| POST   | /api/auth/login    | Login, mengembalikan token JWT                | -    |
| GET    | /api/auth/me       | Data user yang sedang login                   | ✅   |
| GET    | /api/items         | Daftar item (`?search=`, `?page=`, `?limit=`) | ✅   |
| GET    | /api/items/:id     | Detail satu item                              | ✅   |
| POST   | /api/items         | Buat item baru                                | ✅   |
| PUT    | /api/items/:id     | Update item                                   | ✅   |
| DELETE | /api/items/:id     | Hapus item                                    | ✅   |

Semua endpoint ber-`✅` butuh header `Authorization: Bearer <token>`.

## Pagination

`GET /api/items` mendukung pagination lewat query param:

- `page` — nomor halaman (default `1`)
- `limit` — jumlah item per halaman (default `10`, maksimal `100`)

Response-nya menyertakan metadata:

```json
{
  "items": [...],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "hasPrevPage": false,
  "hasNextPage": true
}
```

Di frontend Angular, `DashboardComponent` menyimpan state `page`/`totalPages` dan memanggil `ItemService.getItems(search, page, limit)` di setiap fetch. Komponen baru `PaginationComponent` menampilkan tombol "Sebelumnya"/"Berikutnya" di dalam `ItemListComponent`, otomatis disembunyikan bila hanya ada 1 halaman. Pencarian (`search`) otomatis mereset ke halaman 1.

## Cara mengembangkan lebih lanjut

- Ganti model `Item` (backend) sesuai domain bisnis Anda — frontend tinggal menyesuaikan `core/models/models.ts` dan form di `ItemDetailComponent`.
- Tambahkan role-based guard di Angular dengan membaca `authService.user()?.role`, dipadukan dengan middleware `adminOnly` yang sudah ada di backend.
- Untuk state management yang lebih kompleks, pertimbangkan NgRx atau tetap dengan RxJS + signals seperti pada skeleton ini.
