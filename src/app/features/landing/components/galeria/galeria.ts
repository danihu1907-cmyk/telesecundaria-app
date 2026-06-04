import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaleriaService } from '../../services/galeria.service'; // Ajusta la ruta a tu servicio
import { GaleriaElemento } from '../../models/galeria.model'; // Ajusta la ruta a tu modelo
@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css',
})
export class GaleriaComponent implements OnInit {
  // Signal reactivo donde el HTML leerá las imágenes
  public imagenesGaleria = signal<GaleriaElemento[]>([]);

  // Inyección clásica por constructor, igual a tu BannerHeroService
  constructor(private _galeriaService: GaleriaService) {}

  ngOnInit(): void {
    this.cargarImagenes();
  }

  /**
   * Se suscribe al servicio para obtener las fotos del JSON de pruebas.
   * Aplica un corte estricto a 3 elementos para asegurar la simetría del diseño.
   */
  private cargarImagenes(): void {
    this._galeriaService.obtenerImagenes().subscribe({
      next: (datosServidor) => {
        // Candado de seguridad: Máximo 3 imágenes en el grid principal
        const datosLimitados = datosServidor.slice(0, 3);
        this.imagenesGaleria.set(datosLimitados);
      },
      error: (err) => {
        console.error('Error al cargar los datos de la galería:', err);
      },
    });
  }
}
