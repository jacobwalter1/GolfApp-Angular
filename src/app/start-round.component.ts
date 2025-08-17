import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-start-round',
  templateUrl: './start-round.component.html',
  styleUrls: ['./start-round.component.css'],
})
export class StartRoundComponent {
  courseName = '';
  teeColor = '';
  numberOfHoles = 0;
  startingHole = 1;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.courseName = params['courseName'] || '';
      this.teeColor = params['teeColor'] || '';
      this.numberOfHoles = +params['numberOfHoles'] || 0;
      this.startingHole = +params['startingHole'] || 1;
    });
  }
}
