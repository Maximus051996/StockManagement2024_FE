import { Component, OnInit } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    HttpClientModule,
    ProgressBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isLoader: boolean = false;
  loginForm!: FormGroup;
  serverUrl = environment.serverUrl;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}
  ngOnInit() {
    this.createForm();
    if (this.authService.getJwtToken()) {
      this.router.navigate(['/home']);
    }
  }
  createForm() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      userPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.isLoader = true;
      this.http
        .post(`${this.serverUrl}login`, formData, { withCredentials: false })
        .subscribe(
          (response: any) => {
            setTimeout(() => {
              this.isLoader = false;
              localStorage.setItem('token', response.token);
              this.router.navigate(['/home']);
              this.authService.enableAuthenticationSubject();
              location.reload();
            }, 3000);
          },
          (error) => {
            setTimeout(() => {
              this.isLoader = false;
              console.error('Login failed:', error);
            }, 3000);
          }
        );
    }
  }
}
