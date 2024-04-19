import { Component, OnInit } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-ins-dashboard',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './ins-dashboard.component.html',
  styleUrl: './ins-dashboard.component.scss',
})
export class InsDashboardComponent implements OnInit {
  isLoader = true;
  constructor() {}
  ngOnInit(): void {
    this.loader();
  }

  loader() {
    setTimeout(() => {
      this.isLoader = false;
    }, 3000);
  }
}
