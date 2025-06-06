import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'  // service in root der app verfügbar
})
export class DarkModeService {
  private renderer: Renderer2;
  private darkModeKey = 'dark-mode';  //schlüssel für localstorage
  private darkClass = 'dark'; //css klasse für dunkelmodus

  constructor(rendererFactory: RendererFactory2) {
    //renderer erzeugen
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadTheme(); //beim start gespeichertes theme laden
  }

  //umschalten zwischen hell und dunkelmodus
  toggleDarkMode(): void {
    const htmlElement = document.documentElement; //<html>-tag
    if (htmlElement.classList.contains(this.darkClass)) {
      //ist aktuell dunkel? dann entfernen und in local storage als false speicern
      this.renderer.removeClass(htmlElement, this.darkClass);
      localStorage.setItem(this.darkModeKey, 'false');
    } else {
      //ist aktuell hell? dann dunkelklasse hinzufüen und speichern
      this.renderer.addClass(htmlElement, this.darkClass);
      localStorage.setItem(this.darkModeKey, 'true');
    }
  }

  //lädt beim start das zuvor gespeicherte theme
  loadTheme(): void {
    //prüft localstorage true = dunkelmodus aktiv
    const isDarkMode = localStorage.getItem(this.darkModeKey) === 'true';
    if (isDarkMode) {
      this.renderer.addClass(document.documentElement, this.darkClass);
    } else {
      this.renderer.removeClass(document.documentElement, this.darkClass);
    }
  }
}
