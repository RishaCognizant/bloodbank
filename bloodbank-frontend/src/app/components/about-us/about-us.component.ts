import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "../home/home.component";
import { NavbarComponent } from '../navbar/navbar.component';

interface TeamMember {
  id: string;
  name: string;
  teamId: string;
  cohortId: number;
  image?: string;
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [MatIconModule, CommonModule, NavbarComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  teamMembers: TeamMember[] = [
    {
      id: '2494408',
      name: 'Risha',
      teamId: 'TEAM-1',
      cohortId: 10,
      image: 'assets/img/team1.jpg'
    },
    {
      id: '2494468',
      name: 'Shelly',
      teamId: 'TEAM-1',
      cohortId: 10,
      image: 'assets/img/team2.jpg'
    },
    {
      id: '2494579',
      name: 'Ujjwal',
      teamId: 'TEAM-1',
      cohortId: 10,
      image: 'assets/img/team3.jpg'
    },
    {
      id: '2494395',
      name: 'Ansh',
      teamId: 'TEAM-1',
      cohortId: 10,
      image: 'assets/img/team4.jpg'
    },
    {
      id: '2494435',
      name: 'Praveen',
      teamId: 'TEAM-1',
      cohortId: 10,
      image: 'assets/img/team5.jpg'
    },
    {
      id: '2494405',
      name: 'Sriram',
      teamId: 'TEAM-1',
      cohortId: 10,
      image: 'assets/img/team6.jpg'
    }
  ];
}
