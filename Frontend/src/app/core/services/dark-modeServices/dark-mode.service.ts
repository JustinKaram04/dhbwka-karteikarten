import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private renderer: Renderer2;
  private darkModeKey = 'dark-mode';
  private darkClass = 'dark';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadTheme();
  }

  toggleDarkMode(): void {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains(this.darkClass)) {
      this.renderer.removeClass(htmlElement, this.darkClass);
      localStorage.setItem(this.darkModeKey, 'false');
    } else {
      this.renderer.addClass(htmlElement, this.darkClass);
      localStorage.setItem(this.darkModeKey, 'true');
    }
  }

  loadTheme(): void {
    const isDarkMode = localStorage.getItem(this.darkModeKey) === 'true';
    if (isDarkMode) {
      this.renderer.addClass(document.documentElement, this.darkClass);
    } else {
      this.renderer.removeClass(document.documentElement, this.darkClass);
    }
  }
}
