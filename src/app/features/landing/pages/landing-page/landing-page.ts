import { Component } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../shared/components/footer/footer';
import { Conocenos } from '../../components/conocenos/conocenos';
import { Convocatorias } from '../../components/convocatorias/convocatorias';
import { Cursos } from '../../components/cursos/cursos';
import { Estadisticas } from '../../components/estadisticas/estadisticas';
import { Galeria } from '../../components/galeria/galeria';
import { Hero } from '../../components/hero/hero';
import { Materiales } from '../../components/materiales/materiales';

@Component({
  selector: 'app-landing-page',
  imports: [
    Navbar,
    Footer,
    Conocenos,
    Convocatorias,
    Cursos,
    Estadisticas,
    Galeria,
    Hero,
    Materiales,
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {}
