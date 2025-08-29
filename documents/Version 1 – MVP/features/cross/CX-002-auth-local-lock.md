# Cross - CX-002 Auth (Single-User Mode) + Local Lock

## User Story

As a user, I want a simple login/lock so that only I can access my health data on my device.

## Goals

- Single-user mode (no multi-tenant yet).
- Local PIN/biometric lock to secure access.
- Keep session offline (no server login needed in V1).

## Non-Goals

- Multi-user accounts (future).
- Social login or OAuth.

## Assumptions

- Capacitor/Angular app; use device biometrics when available.

## UX / Flow

1. First app start → set PIN (optional biometric prompt).
2. App locked after timeout/close.
3. On open → enter PIN or use biometrics.
4. Unlock → profile + data visible.

## API

- None (local only for V1).

## Data Model

- Local storage: `{ auth: { pinHash, biometricsEnabled, lastUnlock } }`.

## Acceptance Criteria

- [ ] User sets PIN on first run.
- [ ] Unlock required when app opens or after timeout.
- [ ] Biometric works if enabled.
- [ ] If PIN forgotten → reset app (data wipe).

## Tasks (Frontend)

- [ ] PIN entry + set screens.
- [ ] Biometric integration (Capacitor plugin).
- [ ] Local storage + timeout logic.

## Tasks (Backend)

- None (until multi-user support in later version).
