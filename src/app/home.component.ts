import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page',
  standalone: true,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly title = signal('Golf-App');
  private firestore = inject(Firestore);
  private router = inject(Router);

  async addTestData() {
    try {
      const docRef = await addDoc(collection(this.firestore, 'testCollection'), {
        message: 'Hello from Angular!',
        timestamp: new Date(),
      });
      alert('Document written with ID: ' + docRef.id);
    } catch (e) {
      alert('Error adding document: ' + (e instanceof Error ? e.message : e));
    }
  }

  addRound() {
    this.router.navigate(['/add-round']);
  }
}
