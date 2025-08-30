import { TestBed } from "@angular/core/testing";
import { LockService } from "../services/lock.service";

describe("LockService", () => {
  let service: LockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LockService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should not be setup initially", async () => {
    const isSetup = await service.isSetup();
    expect(isSetup).toBeFalsy();
  });

  it("should setup PIN correctly", async () => {
    const testPin = "1234";

    await service.setupPin(testPin);
    const isSetup = await service.isSetup();

    expect(isSetup).toBeTruthy();
  });

  it("should unlock with correct PIN", async () => {
    const testPin = "1234";

    await service.setupPin(testPin);
    const unlocked = await service.unlockWithPin(testPin);

    expect(unlocked).toBeTruthy();
  });

  it("should not unlock with incorrect PIN", async () => {
    const testPin = "1234";
    const wrongPin = "4321";

    await service.setupPin(testPin);
    const unlocked = await service.unlockWithPin(wrongPin);

    expect(unlocked).toBeFalsy();
  });

  it("should require minimum PIN length", async () => {
    const shortPin = "123";

    await expectAsync(service.setupPin(shortPin)).toBeRejected();
  });

  it("should lock after timeout", async () => {
    const testPin = "1234";

    await service.setupPin(testPin);
    await service.updateTimeout(1000); // 1 second

    // Wait for timeout
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const shouldLock = await service.shouldLock();
    expect(shouldLock).toBeTruthy();
  });

  it("should force lock", async () => {
    const testPin = "1234";

    await service.setupPin(testPin);
    await service.forceLock();

    const shouldLock = await service.shouldLock();
    expect(shouldLock).toBeTruthy();
  });

  it("should change PIN with valid current PIN", async () => {
    const currentPin = "1234";
    const newPin = "5678";

    await service.setupPin(currentPin);
    const success = await service.changePin(currentPin, newPin);

    expect(success).toBeTruthy();

    // Should unlock with new PIN
    const unlockedWithNew = await service.unlockWithPin(newPin);
    expect(unlockedWithNew).toBeTruthy();

    // Should not unlock with old PIN
    const unlockedWithOld = await service.unlockWithPin(currentPin);
    expect(unlockedWithOld).toBeFalsy();
  });

  it("should not change PIN with invalid current PIN", async () => {
    const currentPin = "1234";
    const wrongPin = "4321";
    const newPin = "5678";

    await service.setupPin(currentPin);
    const success = await service.changePin(wrongPin, newPin);

    expect(success).toBeFalsy();
  });

  afterEach(async () => {
    // Clean up after each test
    await service.resetAuth();
  });
});
