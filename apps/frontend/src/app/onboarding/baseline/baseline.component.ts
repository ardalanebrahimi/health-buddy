import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-baseline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="baseline-container">
      <h1>Baseline Health Assessment</h1>
      <p>This is a placeholder for UP-002 - Baseline Health & Pain Areas</p>
      <p>Coming soon...</p>
    </div>
  `,
  styles: [`
    .baseline-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem 1rem;
      text-align: center;
      
      h1 {
        font-size: 1.875rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text-primary, #1f2937);
      }
      
      p {
        color: var(--text-secondary, #6b7280);
        margin-bottom: 0.5rem;
      }
    }
  `]
})
export class BaselineComponent {
}
