import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { getDoc, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-start-round',
  templateUrl: './start-round.component.html',
  styleUrls: ['./start-round.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class StartRoundComponent {
  driveOption: string | null = null;
  greenInRegulation: string | null = null;
  selectGreenInRegulation(option: string) {
    this.greenInRegulation = option;
  }
  selectScore(n: number, item: HTMLElement) {
    this.selectedScore = n;
    if (item && item.scrollIntoView) {
      item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }
  courseId = '';
  teeColor = '';
  numberOfHoles = 0;
  startingHole = 1;
  currentHole = 1;
  selectedScore: number = 4;
  private firestore = inject(Firestore);

  courseDetails: any;

  distanceInput: number = 0;
  parInput: number = 0;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.courseId = params['courseId'] || '';
      this.teeColor = params['teeColor'] || '';
      this.numberOfHoles = +params['numberOfHoles'] || 0;
      this.startingHole = +params['startingHole'] || 1;
      this.getCourseDetail();
      this.currentHole = this.startingHole;
    });
  }

  selectDriveOption(option: string) {
    this.driveOption = option;
  }

  async getCourseDetail() {
    if (!this.courseId || !this.teeColor) return null;
    const ref = doc(this.firestore, `courseTees/${this.courseId}_${this.teeColor}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      this.createCourseDetails();
      this.courseDetails = null;
    } else {
      this.courseDetails = snap.data();
    }
    return this.courseDetails;
  }

  async createCourseDetails() {
    if (!this.courseId || !this.teeColor) return;
    const ref = doc(this.firestore, `courseTees/${this.courseId}_${this.teeColor}`);
    try {
      await setDoc(ref, {});
    } catch (error) {
      console.error('Error creating course details:', error);
      alert('Failed to create course details.');
    }
    this.getCourseDetail();
  }

  getHoleDetails() {
    if (this.courseDetails['hole' + this.currentHole] !== null) {
      return this.courseDetails['hole' + this.currentHole];
    }
    return null;
  }

  async setHoleDetails(distance: number, par: number) {
    if (!this.courseDetails) return;
    const holeKey = 'hole' + this.currentHole;
    this.courseDetails[holeKey] = [distance, par];
    const ref = doc(this.firestore, `courseTees/${this.courseId}_${this.teeColor}`);
    try {
      await setDoc(ref, { [holeKey]: [distance, par] }, { merge: true });
    } catch (error) {
      console.error('Error updating hole details:', error);
    }
  }

  changeHole(direction: number) {
    this.currentHole += direction;

    // Clamp to valid range if starting at 1
    if (this.startingHole === 1) {
      if (this.currentHole < 1) {
        this.currentHole = 1;
        return;
      }
      if (
        (this.numberOfHoles === 18 && this.currentHole > 18) ||
        (this.numberOfHoles === 9 && this.currentHole > 9)
      ) {
        this.endRound();
        return;
      }
    } else {
      // If not starting at 1, wrap or end round as appropriate
      if (this.numberOfHoles === 9 && this.currentHole > 18) {
        this.endRound();
        return;
      }
      if (this.numberOfHoles === 18 && this.currentHole > 9) {
        this.endRound();
        return;
      }
      if (this.currentHole > 18) {
        this.currentHole = 1;
        return;
      }
    }

    this.getHoleDetails();
  }

  endRound() {
    // Logic to end the round
  }
}
