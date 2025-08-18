import {
  Component,
  signal,
  effect,
  inject,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { setDoc, doc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { arrayUnion, updateDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'add-round',
  standalone: true,
  templateUrl: './add-round.component.html',
  styleUrls: ['./add-round.component.css'],
  imports: [FormsModule, CommonModule],
})
export class AddRoundComponent implements AfterViewChecked {
  @ViewChild('customTeeInput') customTeeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('newCourseInput') newCourseInput!: ElementRef<HTMLInputElement>;
  private shouldFocusCustomTee = false;
  private shouldFocusNewCourse = false;
  searchTerm = '';
  selectedCountry = '';
  courses = signal<any[]>([]);
  teeColor = '';
  selectedCourseId = '';
  numberOfHoles = 0;
  startingHole = 1;
  submitting = false;
  private firestore = inject(Firestore);
  router = inject(Router);

  showAddCoursePopup = false;
  newCourseName = '';
  addCourseMessage = '';

  showCustomTeeNamePopup = false;
  customTeeName = '';
  customTeeMessage = '';

  showCustomTeePopup() {
    this.showCustomTeeNamePopup = true;
    this.customTeeName = '';
    this.customTeeMessage = '';
    this.shouldFocusCustomTee = true;
  }
  ngAfterViewChecked() {
    if (this.showCustomTeeNamePopup && this.shouldFocusCustomTee && this.customTeeInput) {
      this.customTeeInput.nativeElement.focus();
      this.shouldFocusCustomTee = false;
    }
    if (this.showAddCoursePopup && this.shouldFocusNewCourse && this.newCourseInput) {
      this.newCourseInput.nativeElement.focus();
      this.shouldFocusNewCourse = false;
    }
  }

  hideCustomTeePopup() {
    this.showCustomTeeNamePopup = false;
    this.customTeeName = '';
    this.customTeeMessage = '';
  }

  async saveCustomTeeName() {
    if (!this.customTeeName.trim()) {
      this.customTeeMessage = 'Tee name is required.';
      return;
    }
    this.teeColor = this.customTeeName.trim();
    try {
      await updateDoc(doc(this.firestore, 'courses', this.selectedCourseId), {
        tees: arrayUnion(this.teeColor),
      });
      this.addCourseMessage = 'Tee added!';
      this.hideCourseForm();
    } catch (e) {
      this.addCourseMessage = 'Error adding Tee.';
    }
    this.hideCustomTeePopup();
  }

  constructor() {
    const coursesCollection = collection(this.firestore, 'courses');
    effect(() => {
      collectionData(coursesCollection, { idField: 'id' }).subscribe((data) => {
        this.courses.set(data);
      });
    });
  }

  filteredCourses() {
    return this.courses().filter((course) => {
      const matchesSearch =
        !this.searchTerm || course.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesSearch;
    });
  }

  showCourseForm() {
    this.showAddCoursePopup = true;
    this.newCourseName = '';
    this.addCourseMessage = '';
    this.shouldFocusNewCourse = true;
  }

  hideCourseForm() {
    this.showAddCoursePopup = false;
    this.newCourseName = '';
    this.addCourseMessage = '';
  }

  async saveNewCourse() {
    if (!this.newCourseName.trim()) {
      this.addCourseMessage = 'Course name is required.';
      return;
    }
    try {
      await setDoc(doc(this.firestore, 'courses', this.newCourseName), {
        name: this.newCourseName.trim(),
      });
      this.addCourseMessage = 'Course added!';
      this.hideCourseForm();
    } catch (e) {
      this.addCourseMessage = 'Error adding course.';
    }
  }

  setSelectedCourse(courseId: string) {
    this.selectedCourseId = courseId;
    console.log('Selected course:', this.selectedCourseId);
  }

  setNumberOfHoles(numberOfHoles: number) {
    this.numberOfHoles = numberOfHoles;
  }

  getKnownTees() {
    const course = this.courses().find((c) => c.id === this.selectedCourseId);
    console.log('Known tees for course:', course?.tees);
    return course?.tees || [];
  }

  setTeeColor(color: string) {
    this.teeColor = color;
  }

  setStartingHole(hole: number) {
    this.startingHole = hole;
  }

  startRound(){
    this.router.navigate(['/start-round'], {
      queryParams: {
        courseId: this.selectedCourseId,
        teeColor: this.teeColor,
        numberOfHoles: this.numberOfHoles,
        startingHole: this.startingHole
      }
    });
  }
}
