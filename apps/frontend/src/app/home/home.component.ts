import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { environment } from "../../environments/environment";

interface HealthCheckResponse {
  status: string;
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  apiStatus: "loading" | "ok" | "error" = "loading";
  apiStatusMessage = "Checking...";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkApiHealth();
  }

  checkApiHealth() {
    this.apiStatus = "loading";
    this.apiStatusMessage = "Checking...";

    // Try to call the backend health endpoint
    const healthUrl = `${environment.apiBaseUrl.replace("/api/v1", "")}/health`;

    this.http.get<HealthCheckResponse>(healthUrl).subscribe({
      next: (response) => {
        if (response.status === "ok") {
          this.apiStatus = "ok";
          this.apiStatusMessage = "API is healthy ✅";
        } else {
          this.apiStatus = "error";
          this.apiStatusMessage = `Unexpected response: ${response.status}`;
        }
      },
      error: (error) => {
        console.error("Health check failed:", error);
        this.apiStatus = "error";
        this.apiStatusMessage = `Failed to connect to API at ${healthUrl}`;
      },
    });
  }
}
