import { Component, inject, OnInit, computed } from '@angular/core';
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

  // NUEVO COMPUTED: GENERA LAS INICIALES EN TIEMPO REAL DESDE LA BASE DE DATOS
  public inicialesTutor = computed(() => {
    const nombre = this.datos()?.nombreTutor || '';
    if (!nombre) return '';

    const partes = nombre.trim().split(/\s+/);
    if (partes.length >= 2) {
      return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
    }
    return partes[0].charAt(0).toUpperCase();
  });

  ngOnInit() {
    this.tutorService.obtenerDashboardTutor().subscribe();
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
