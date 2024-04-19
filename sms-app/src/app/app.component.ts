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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sms-app';
  isAuthenticated = false;
  authSubscription: Subscription = new Subscription();
  isToken: string | null = null; // Declare isToken property
  navigationItems: NavigationItem[] = [
    {
      routerLink: '/home',
      url: 'https://png.pngtree.com/png-vector/20230302/ourmid/pngtree-dashboard-line-icon-vector-png-image_6626604.png',
      label: 'Dashboard',
    },
    {
      routerLink: '/home',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm40rYk_i1sTTwPmcbw5ph6SI3xbh4o2T4KoDhJ_tUHw&s',
      label: 'Company',
    },
    {
      routerLink: '/products',
      url: 'https://static.vecteezy.com/system/resources/thumbnails/028/047/017/small/3d-check-product-free-png.png',
      label: 'Product',
    },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isToken = this.authService.getJwtToken();
    this.authSubscription = this.authService
      .isAuthenticated()
      .subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
      });
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
}
