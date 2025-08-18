import { Routes } from '@angular/router';
import { AddRoundComponent } from './add-round/add-round.component';
import { HomeComponent } from './home/home.component';
import { StartRoundComponent } from './start-round/start-round.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-round', component: AddRoundComponent },
  { path: 'start-round', component: StartRoundComponent },
];
