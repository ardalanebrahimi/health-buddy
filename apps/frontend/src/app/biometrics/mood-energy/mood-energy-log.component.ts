import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { BiometricsService } from "../biometrics.service";

@Component({
  selector: "app-mood-energy-log",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./mood-energy-log.component.html",
  styleUrls: ["./mood-energy-log.component.scss"],
})
export class MoodEnergyLogComponent {
  private biometricsService = inject(BiometricsService);
  private router = inject(Router);

  // Available mood options
  readonly moodOptions = ["😀", "🙂", "😐", "🙁", "😴", "😊", "🤗"];

  // Component state
  selectedMood = signal<string | null>(null);
  energyLevel = signal<number>(5);
  isLoading = signal<boolean>(false);

  selectMood(mood: string) {
    this.selectedMood.set(mood);
  }

  onEnergyChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.energyLevel.set(parseInt(target.value));
  }

  async save() {
    const mood = this.selectedMood();
    const energy = this.energyLevel();

    if (!mood) {
      // Could show toast notification here
      return;
    }

    this.isLoading.set(true);

    try {
      const takenAt = new Date().toISOString();

      // Save mood and energy in parallel
      await Promise.all([
        this.biometricsService.logMood({ mood, takenAt }),
        this.biometricsService.logEnergy({ score: energy, takenAt }),
      ]);

      // Navigate back or show success
      this.router.navigate(["/home"]);
    } catch (error) {
      console.error("Error saving mood/energy:", error);
      // Could show error toast here
    } finally {
      this.isLoading.set(false);
    }
  }

  cancel() {
    this.router.navigate(["/home"]);
  }
}
