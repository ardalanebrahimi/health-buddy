import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { BiometricsService } from "../biometrics.service";

export interface BPEntry {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  takenAt: string;
  createdAt: string;
}

export interface HREntry {
  id: string;
  bpm: number;
  takenAt: string;
  createdAt: string;
}

@Component({
  standalone: true,
  selector: "app-bp-hr-log",
  templateUrl: "./bp-hr-log.component.html",
  styleUrls: ["./bp-hr-log.component.scss"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class BpHrLogComponent implements OnInit {
  private biometrics = inject(BiometricsService);

  activeTab: "bp" | "hr" = "bp";
  isLoading = false;
  recentBP: BPEntry[] = [];
  recentHR: HREntry[] = [];

  bpForm = new FormGroup({
    systolic: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(80),
      Validators.max(200),
    ]),
    diastolic: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(50),
      Validators.max(120),
    ]),
    pulse: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(40),
      Validators.max(180),
    ]),
    takenAt: new FormControl<string>(new Date().toISOString().slice(0, 16), [
      Validators.required,
    ]),
  });

  hrForm = new FormGroup({
    bpm: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(30),
      Validators.max(200),
    ]),
    takenAt: new FormControl<string>(new Date().toISOString().slice(0, 16), [
      Validators.required,
    ]),
  });

  ngOnInit() {
    this.loadRecentEntries();
  }

  async loadRecentEntries() {
    try {
      this.isLoading = true;
      const [bpEntries, hrEntries] = await Promise.all([
        this.biometrics.getRecentBP(10),
        this.biometrics.getRecentHR(10),
      ]);
      this.recentBP = bpEntries;
      this.recentHR = hrEntries;
    } catch (error) {
      console.error("Error loading recent entries:", error);
    } finally {
      this.isLoading = false;
    }
  }

  async saveBP() {
    if (this.bpForm.valid && !this.isLoading) {
      try {
        this.isLoading = true;
        const formValue = this.bpForm.getRawValue();

        await this.biometrics.logBP({
          systolic: formValue.systolic!,
          diastolic: formValue.diastolic!,
          pulse: formValue.pulse!,
          takenAt: formValue.takenAt!,
        });

        // Reset form and reload data
        this.bpForm.reset({
          takenAt: new Date().toISOString().slice(0, 16),
        });
        await this.loadRecentEntries();
      } catch (error) {
        console.error("Error saving blood pressure:", error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async saveHR() {
    if (this.hrForm.valid && !this.isLoading) {
      try {
        this.isLoading = true;
        const formValue = this.hrForm.getRawValue();

        await this.biometrics.logHR({
          bpm: formValue.bpm!,
          takenAt: formValue.takenAt!,
        });

        // Reset form and reload data
        this.hrForm.reset({
          takenAt: new Date().toISOString().slice(0, 16),
        });
        await this.loadRecentEntries();
      } catch (error) {
        console.error("Error saving heart rate:", error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  switchTab(tab: "bp" | "hr") {
    this.activeTab = tab;
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString();
  }

  get isBPFormValid(): boolean {
    return this.bpForm.valid;
  }

  get isHRFormValid(): boolean {
    return this.hrForm.valid;
  }
}
