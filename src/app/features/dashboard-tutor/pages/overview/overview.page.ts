import { Component, inject, OnInit } from '@angular/core'; // CORREGIDO: IMPORTE DESDE CORE
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TutorService } from '../../services/tutor.service';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { AspiranteCardComponent } from '../../components/aspirante-card/aspirante-card.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardHeaderComponent, AspiranteCardComponent],
  templateUrl: './overview.page.html',
  styleUrl: './overview.page.css',
})
export class OverviewComponent implements OnInit {
  private tutorService = inject(TutorService);
  private router = inject(Router);

  public datos = this.tutorService.datosDashboard;
  public cargando = this.tutorService.cargando;

  ngOnInit() {
    this.tutorService.obtenerDashboardTutorMock('TUT-2026-MOCK').subscribe();
  }

  completarDocumentosAspirante(claveAspirante: string): void {
    this.router.navigate(['/dashboard/register-flow'], {
      queryParams: { claveAspirante: claveAspirante },
    });
  }

  onLogout() {
    this.tutorService.logout();
  }
}
