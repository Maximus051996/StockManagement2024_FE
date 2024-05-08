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
import { Subscription } from 'rxjs';
import { NavigationItem } from './core/interfaces/navigation';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MatDividerModule } from '@angular/material/divider';
import { ChipModule } from 'primeng/chip';

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
  navigationItems: NavigationItem[] = [
    {
      routerLink: '/home',
      path: 'assets/dashboard.png',
      label: 'Dashboard',
    },
    {
      routerLink: '/company',
      path: 'assets/company.jpeg',
      label: 'Company',
    },
    {
      routerLink: '/product',
      path: 'assets/product.webp',
      label: 'Product',
    },
    {
      routerLink: '/calculation',
      path: 'assets/calculation.png',
      label: 'Calculation',
    },
  ];

  constructor(private router: Router, private authService: AuthService) {
    this.getuserData();
  }

  ngOnInit(): void {
    this.userAuthenticated();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  logOut(): void {
    this.isToken = null;
    localStorage.removeItem('token');
    this.authService.disableAuthenticationSubject();
    this.router.navigate(['/login']);
  }

  userAuthenticated() {
    this.isToken = this.authService.getJwtToken();
    this.authSubscription = this.authService
      .isAuthenticated()
      .subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  getuserData() {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.userName = userDetails.userName;
      this.roleName =
        userDetails.roleId === 'R1' ? 'Sales Assistant' : 'Instructor';
    }
  }
}
