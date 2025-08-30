# Auth-Lock Feature

This feature implements **CX-002 Auth (Single-User Mode) + Local Lock** for the Health Companion app.

## Overview

A complete authentication system for single-user mode with PIN-based locking and optional biometric authentication. All data is stored locally using Capacitor Preferences.

## Features

### ✅ Implemented

- **PIN Setup**: 4-6 digit PIN creation with confirmation
- **Lock Screen**: Numeric keypad with error handling and cooldown
- **Biometric Support**: Framework ready (plugin integration needed)
- **Auto-lock**: Configurable timeout (1min - 1hour)
- **Settings**: Change PIN, toggle biometrics, adjust timeout
- **Route Protection**: Guard prevents access to protected routes
- **Lifecycle Management**: Locks on app background/foreground
- **Security**: PBKDF2 PIN hashing with salt (100k iterations)
- **Reset Flow**: Complete app reset if PIN forgotten

### 🔧 Security Features

- PIN never stored in plain text
- Salt-based hashing with WebCrypto API
- Automatic lock on app background
- Idle timeout detection
- Rate limiting with exponential backoff
- Secure preferences storage

## File Structure

```
auth-lock/
├── services/
│   ├── lock.service.ts           # Core lock/unlock logic
│   ├── biometric.service.ts      # Biometric authentication wrapper
│   └── lock.service.spec.ts      # Unit tests
├── guards/
│   └── lock.guard.ts             # Route protection
├── components/
│   ├── pin-setup.component.ts    # First-run PIN setup
│   ├── lock-screen.component.ts  # Unlock interface
│   └── settings-lock.component.ts # Security settings
├── types/
│   └── auth-state.type.ts        # TypeScript interfaces
└── index.ts                      # Public API exports
```

## Usage

### Setup Routes

```typescript
import { lockGuard } from "./auth-lock/guards/lock.guard";

const routes: Routes = [
  {
    path: "setup-pin",
    loadComponent: () => import("./auth-lock/components/pin-setup.component"),
  },
  {
    path: "lock",
    loadComponent: () => import("./auth-lock/components/lock-screen.component"),
  },
  { path: "", component: HomeComponent, canMatch: [lockGuard] }, // Protected route
];
```

### Lifecycle Integration

```typescript
// In app.component.ts
import { LockService } from "./auth-lock/services/lock.service";

// Handle app background/foreground
App.addListener("appStateChange", async ({ isActive }) => {
  if (!isActive) {
    await lockService.forceLock();
  }
});
```

### Using the Service

```typescript
import { LockService } from "./auth-lock/services/lock.service";

// Check setup status
const isSetup = await lockService.isSetup();

// Setup PIN
await lockService.setupPin("1234");

// Unlock
const success = await lockService.unlockWithPin("1234");

// Configure timeout
await lockService.updateTimeout(600000); // 10 minutes
```

## Data Model

```typescript
interface AuthState {
  pinHash?: string; // base64 encoded PBKDF2 hash
  pinSalt?: string; // base64 encoded salt
  biometricsEnabled?: boolean;
  lastUnlock?: string; // ISO string (UTC)
  lockTimeoutMs?: number; // milliseconds (default: 300000)
  version: 1; // schema version
}
```

## API Reference

### LockService

| Method                    | Description                    |
| ------------------------- | ------------------------------ |
| `isSetup()`               | Check if PIN is configured     |
| `setupPin(pin)`           | Configure new PIN              |
| `unlockWithPin(pin)`      | Verify PIN and unlock          |
| `unlockWithBiometrics()`  | Biometric unlock (placeholder) |
| `shouldLock()`            | Check if app should be locked  |
| `forceLock()`             | Immediately lock the app       |
| `updateTimeout(ms)`       | Set auto-lock timeout          |
| `changePin(current, new)` | Change existing PIN            |
| `resetAuth()`             | Clear all auth data            |

### BiometricService

| Method                     | Description                  |
| -------------------------- | ---------------------------- |
| `isAvailable()`            | Check biometric availability |
| `verify(reason)`           | Prompt for biometric auth    |
| `getBiometryDescription()` | Get user-friendly name       |

## User Flows

### First Run

1. App detects no PIN → Navigate to `/setup-pin`
2. User enters & confirms PIN
3. Optional biometric opt-in
4. Navigate to home

### Daily Use

1. App opens → Check if should be locked
2. If locked → Navigate to `/lock`
3. User enters PIN or uses biometrics
4. Navigate to intended destination

### Forgotten PIN

1. Multiple failed attempts → Show reset option
2. User confirms reset (warning about data loss)
3. Clear all preferences → Navigate to `/setup-pin`

## Testing

Run the test suite:

```bash
ng test --include='**/auth-lock/**/*.spec.ts'
```

## Security Considerations

- **PIN Storage**: Never stored in plain text
- **Hashing**: PBKDF2 with 100k iterations + random salt
- **Rate Limiting**: Cooldown after failed attempts
- **Auto-lock**: Multiple triggers (timeout, background, visibility)
- **Reset Protection**: Requires explicit confirmation

## Dependencies

```json
{
  "@capacitor/core": "^5.0.0",
  "@capacitor/preferences": "^5.0.0",
  "@capacitor/app": "^5.0.0"
}
```

## Future Enhancements

- Real biometric plugin integration
- Hardware security module support
- Encrypted local storage
- Audit logging
- Multi-factor authentication
- Emergency unlock codes

## Acceptance Criteria ✅

- [x] User sets PIN on first run
- [x] Unlock required when app opens or after timeout
- [x] Biometric works if enabled (framework ready)
- [x] If PIN forgotten → reset app (data wipe)
- [x] Entirely local (no backend calls in V1)
