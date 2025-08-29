# Nutrition - NU-001 Capture/Upload Meal Photo

## User Story

As a user, I want to add a meal by taking or uploading a photo so that the system can recognize foods and log the meal quickly.

## Goals

- Let users attach a photo to create a meal entry.
- Store the raw photo + metadata and create a placeholder Meal record (even before AI recognition).
- Work offline; queue upload/sync when back online.

## Non-Goals

- Food recognition (that’s NU-002).
- Editing detected items/portions (NU-003).

## Assumptions

- Single-user app (no multi-tenant).
- Photos may be large; we will compress client-side.
- If offline, we persist locally and mark as `pending_sync`.

## UX / Flow

1. User taps “+ Meal” (FAB) → options: **Take photo** | **Upload from gallery**.
2. After selection, show a lightweight preview and “Save”.
3. On save:
   - Frontend creates local Meal (status: `draft`, hasPhoto=true).
   - If online: upload to `/meals/photo` and receive `mealId`.
   - If offline: enqueue request; show badge “Pending sync”.
4. Success toast: “Meal saved. Recognition coming next.”

Wireframe notes:

- FAB on home and nutrition list.
- Thumbnail in the meals list with `draft` status pill until NU-002 completes.

## API (OpenAPI stubs)

- **POST /meals/photo**

  - Request: `multipart/form-data`
    - `image` (binary, required)
    - `takenAt` (string, ISO datetime, optional)
    - `notes` (string, optional, max 500)
  - Response: `201`
    ```json
    {
      "mealId": "uuid",
      "photoUrl": "https://cdn/.../meal-uuid.jpg",
      "status": "draft",
      "createdAt": "2025-08-29T09:00:00Z"
    }
    ```
  - Errors:
    - 400 invalid file/type/size
    - 413 payload too large
    - 415 unsupported media
    - 500 server error

- **GET /meals/:mealId**
  - Returns meal metadata (status, photoUrl, createdAt).

## Data Model (DB changes)

Tables/fields:

- `meals`
  - `id` (uuid, pk)
  - `user_id` (uuid, fk)
  - `taken_at` (timestamptz, nullable)
  - `status` (enum: `draft` | `recognized` | `final`)
  - `notes` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
- `meal_photos`
  - `meal_id` (uuid, pk/fk)
  - `photo_url` (text)
  - `width` (int, nullable)
  - `height` (int, nullable)
  - `exif_json` (jsonb, nullable)

## Acceptance Criteria

- [ ] User can take or upload a photo and save a meal.
- [ ] If online, server returns `mealId`, `photoUrl`, `status=draft`.
- [ ] If offline, meal appears locally with `pending_sync` badge; sync later.
- [ ] Max file size enforced (e.g., 8 MB) with clear error message.
- [ ] Supported types: jpg, png, heic (convert to jpg server- or client-side).
      Edge cases:
- [ ] Cancel mid-upload → no meal created.
- [ ] Duplicate taps won’t create duplicate meals (client-side lock).
- [ ] Corrupt image → error toast + retry.

## Telemetry

- Log events:
  - `meal_photo_selected` {source: camera|gallery}
  - `meal_photo_upload_success` {mealId, sizeKB}
  - `meal_photo_upload_failure` {errorCode}
- Metrics:
  - Upload success rate, avg upload size/time.
  - % meals created offline.

## Test Cases

- Unit:
  - Image picker returns blob and metadata.
  - Offline queue enqueues request.
- API:
  - 201 with valid multipart.
  - 400 on missing `image`.
  - 415 on unsupported type.
- E2E:
  - Simulate camera → save → see meal in list with thumbnail.
  - Offline mode: create meal → later sync → server meal visible.

## Tasks (Backend)

- [ ] Endpoint `POST /meals/photo` (NestJS controller + service).
- [ ] S3/GCS upload helper; generate `photoUrl`.
- [ ] Create `meals` (status=`draft`) + `meal_photos` rows.
- [ ] Validation: mime/type/size; HEIC → JPEG conversion (if server-side).
- [ ] OpenAPI update + regenerate SDK.

## Tasks (Frontend)

- [ ] Add FAB “+ Meal” in nutrition screen.
- [ ] Image picker (camera/gallery) + client-side compression.
- [ ] Call SDK `POST /meals/photo`; handle success/error.
- [ ] Local store entry for offline with `pending_sync`.
- [ ] Thumbnail renderer + `draft` status pill.
