import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './core/services/auth.service';
import { Subscription, filter } from 'rxjs';
import { NavigationItem } from './core/interfaces/navigation';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MatDividerModule } from '@angular/material/divider';
import { ChipModule } from 'primeng/chip';
import { SharedService } from './core/services/shared/shared.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    CommonModule,
    LoginComponent,
    RouterLink,
    AvatarModule,
    AvatarGroupModule,
    MatDividerModule,
    ChipModule,
    NgxSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sms-app';
  isAuthenticated = false;
  userName: any;
  roleName: any;
  authSubscription: Subscription = new Subscription();
  isToken: string | null = null; // Declare isToken property
  navigationItems: NavigationItem[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.userAuthenticated();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  logOut(): void {
    this.sharedService.showSpinner();
    this.isToken = null;
    localStorage.removeItem('token');
    this.authService.disableAuthenticationSubject();
    this.router.navigate(['/sms/login']);
  }

  userAuthenticated() {
    this.isToken = this.authService.getJwtToken();
    this.authSubscription = this.authService
      .isAuthenticated()
      .subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.getuserData();
        }

        if (!this.isToken && this.router.url !== '/sms/login') {
          this.router.navigate(['/sms/login']);
        }
      });
  }

  getuserData() {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.userName = userDetails.userName;
      switch (userDetails.roleId) {
        case 'R1':
          this.roleName = 'Sales Assistant';
          this.navigationItems = [];
          this.navigationItems.push(
            {
              routerLink: '/sa/companydetails',
              path: 'assets/company.jpeg',
              label: 'Company',
            },
            {
              routerLink: '/sa/productdetails',
              path: 'assets/product.webp',
              label: 'Product',
            }
          );
          break;
        case 'R2':
          this.roleName = 'Instructor';
          this.navigationItems = [];
          this.navigationItems.push(
            {
              routerLink: '/ins/home',
              path: 'assets/dashboard.png',
              label: 'Dashboard',
            },
            {
              routerLink: '/ins/company',
              path: 'assets/company.jpeg',
              label: 'Company',
            },
            {
              routerLink: '/ins/product',
              path: 'assets/product.webp',
              label: 'Product',
            },
            {
              routerLink: '/ins/calc-percent',
              path: 'assets/calculation.png',
              label: 'Metrics',
            },
            {
              routerLink: '/ins/damage-details',
              path: 'assets/damaged-box.jpg',
              label: 'Liability',
            },
            {
              routerLink: '/ins/user-details',
              path: 'assets/user.png',
              label: 'User',
            }
          );
          break;
        // Add more cases as needed
      }
    }
  }
}
