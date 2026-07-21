import { Component, OnInit, signal } from '@angular/core';
import { GaleriaService } from '../../services/galeria.service'; // Ajusta la ruta a tu servicio
import { GaleriaImagen } from '../../models/galeria.model'; // Ajusta la ruta a tu modelo

@Component({
  selector: 'app-galeria',
  standalone: true,
  templateUrl: './galeria.html',
  styleUrl: './galeria.css',
})
export class GaleriaComponent implements OnInit {
  // Signal reactivo donde el HTML leerá las imágenes
  public imagenesGaleria = signal<GaleriaImagen[]>([]);

  // ESTADOS DE LA PETICION
  public cargando = signal<boolean>(true);
  public hayError = signal<boolean>(false);

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
    this.cargando.set(true);
    this.hayError.set(false);

    this._galeriaService.obtenerImagenes().subscribe({
      next: (datosServidor) => {
        // Candado de seguridad: Máximo 3 imágenes en el grid principal
        const datosLimitados = datosServidor
          .filter((img: GaleriaImagen) => img.tipoRecurso === 'Galería')
          .sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime())
          .slice(0, 3);
        this.imagenesGaleria.set(datosLimitados);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los datos de la galería:', err);
        this.cargando.set(false);
        this.hayError.set(true);
      },
    });
  }
}
