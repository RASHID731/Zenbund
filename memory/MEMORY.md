# Zenbund Project Memory

## Project Structure
- Three sub-projects: `backend/` (Spring Boot), `frontend-mobile/` (Expo/React Native), `frontend-web/` (Next.js stub)
- CLAUDE.md created at repo root with full architecture overview

## Key Files
- `backend/src/main/resources/application.properties` — DB, Cloudinary, JWT config
- `frontend-mobile/lib/api.ts` — singleton `apiClient`, all HTTP calls go here
- `frontend-mobile/contexts/AuthContext.tsx` — auth state + JWT in expo-secure-store
- `frontend-mobile/types/index.ts` — canonical TypeScript interfaces
- `frontend-mobile/constants/theme.ts` — brand colors (purple #736CED), light/dark
- `data-tables.json` — authoritative DB schema reference

## Architecture Notes
- Backend: Controller → Service (interface+impl) → Repository → Entity pattern
- All API endpoints under `/api/*`, JWT Bearer auth
- Images uploaded to Cloudinary via `ImageUploadService`
- Mobile: expo-router file-based routing, `app/_layout.tsx` is root
- Comment anonymity is immutable once posted (key design constraint)
- Offers paginated via `PagedOffersResponse`

## Commands
- Backend: `./mvnw spring-boot:run` (from `backend/`)
- Mobile: `npx expo start` (from `frontend-mobile/`)
- Web: `npm run dev` (from `frontend-web/`)
