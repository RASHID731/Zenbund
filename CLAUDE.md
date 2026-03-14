# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zenbund is a student-only marketplace (campus buy/sell + community threads + 1-on-1 chat). It has three sub-projects:

- `backend/` — Spring Boot 3.5 REST API (Java 21, Maven)
- `frontend-mobile/` — React Native / Expo app (TypeScript, Tamagui)
- `frontend-web/` — Next.js 15 web admin (TypeScript, Tailwind CSS v4) — largely a stub

## Commands

### Backend (run from `backend/`)
```bash
./mvnw spring-boot:run          # Start dev server on :8080
./mvnw test                     # Run all tests
./mvnw test -Dtest=ClassName    # Run a single test class
./mvnw package -DskipTests      # Build JAR
```

### Frontend Mobile (run from `frontend-mobile/`)
```bash
npx expo start          # Start Expo dev server
npx expo start --ios    # Open in iOS simulator
npx expo run:android    # Run on Android
npm run lint            # ESLint
```

### Frontend Web (run from `frontend-web/`)
```bash
npm run dev     # Start Next.js dev server on :3000
npm run build   # Production build
npm run lint    # ESLint
```

## Backend Architecture

Standard Spring Boot layered architecture: `Controller → Service (interface + impl) → Repository → Entity`.

Package root: `com.zenbund.backend`

- **`entity/`** — JPA entities: `User`, `Offer`, `Category`, `Thread`, `ThreadMember`, `Comment`, `Chat`, `Message`, `Wishlist`
- **`controller/`** — REST controllers, one per entity, all under `/api/*`
- **`service/`** — Interface + Impl split (e.g., `OfferService` / `OfferServiceImpl`)
- **`repository/`** — Spring Data JPA repositories
- **`dto/request/`** / **`dto/response/`** — Input/output DTOs, never expose entities directly
- **`security/`** — JWT filter (`JwtAuthenticationFilter`), `JwtUtil`, entry point
- **`config/`** — `SecurityConfig` (Spring Security), `CloudinaryConfig`
- **`exception/`** — `GlobalExceptionHandler` + custom exception types

**Auth flow:** JWT tokens issued on login/register, attached via `Authorization: Bearer <token>` header, validated by `JwtAuthenticationFilter` on every request.

**Image storage:** Cloudinary (configured in `application.properties`). `ImageUploadService` handles uploads. Max file: 5 MB per image, 50 MB per request.

**Database:** PostgreSQL (`zenbund` DB, port 5432). Hibernate `ddl-auto=update` — schema auto-updates on restart.

## Frontend Mobile Architecture

File-based routing via `expo-router`. Entry: `app/_layout.tsx` wraps the tree in `AuthProvider → TamaguiProvider → Stack`.

**Auth:** `contexts/AuthContext.tsx` — `AuthProvider` + `useAuth()` hook. JWT stored in `expo-secure-store`. On 401, `ApiClient` fires an event that `AuthProvider` catches to clear state and redirect to `/login`.

**API layer:** `lib/api.ts` exports a singleton `apiClient` (class `ApiClient` wrapping axios). All HTTP calls go through its typed methods: `get`, `post`, `postFormData`, `put`, `putFormData`, `delete`, `getWithParams`. Base URL is `EXPO_PUBLIC_API_URL` env var or `http://localhost:8080/api`.

**Types:** `types/index.ts` — canonical TypeScript interfaces matching backend DTOs (`User`, `Offer`, `Category`, `Thread`, `ThreadMember`, `Comment`, `Chat`, `Message`, `Wishlist`, `PagedOffersResponse`).

**Theming:** `constants/theme.ts` exports `Colors` (light/dark) with brand purple `#736CED`. Tamagui is configured in `tamagui.config.ts`. Use `useColorScheme()` + `Colors` for theme-aware styling.

**Key screens** (all in `app/`):
- `(tabs)/` — Bottom tab navigator (Home, Search, Community, Profile)
- `listing-detail.tsx` / `seller-listing-detail.tsx` — Public vs. owner listing view
- `chat.tsx` / `threads.tsx` — Messaging and community
- `edit-listing.tsx`, `edit-profile.tsx` — Edit flows
- Modal screens: `filter-modal`, `sort-modal`, `add-comment-modal`, `thread-settings`

**Image handling:** `expo-image-picker` for selection, `expo-image-manipulator` for compression (max 1200px width, JPEG 0.8 quality), then multipart POST via `apiClient.postFormData`.

## Key Conventions

- Backend DTOs are separate from entities — always use DTOs in controllers, never return entities directly.
- Per-thread anonymity for comments is **immutable once posted** — a design constraint enforced in both UI and backend.
- Offers support pagination via `PagedOffersResponse` (page, pageSize, totalOffers, hasNext, hasPrevious).
- The `data-tables.json` at repo root is the authoritative data schema reference.
