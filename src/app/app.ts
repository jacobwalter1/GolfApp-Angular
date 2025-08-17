import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet],
})
export class App {
  protected readonly title = signal('Golf-App');

  splashVisible = signal(false);

  showOcr = signal(false);

  constructor() {
    // Only show splash if not already shown in this browser
    //
    if (!localStorage.getItem('splashShown')) {
      this.splashVisible.set(true);
      setTimeout(() => {
        this.splashVisible.set(false);
        localStorage.setItem('splashShown', 'true');
      }, 3000);
    }
  }
}
