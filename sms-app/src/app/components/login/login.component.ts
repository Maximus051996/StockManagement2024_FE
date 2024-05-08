import { Component, OnInit } from '@angular/core';
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
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedService } from '../../core/services/shared/shared.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Message } from '../../core/constants/messages';
import { UserService } from '../../core/services/user/user.service';
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
    NgxSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  serverUrl = environment.serverUrl;
  hide = true;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private http: HttpClient,
    private userService: UserService
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

  async onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.sharedService.showSpinner();
      let response = await this.userService.Userlogin(formData);
      if (response.token) {
        setTimeout(() => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/home']);
          this.sharedService.openSnackBar(Message.loginSuccessMsg, 'OK');
          this.authService.enableAuthenticationSubject();
          location.reload();
        }, 3000);
      } else {
        setTimeout(() => {
          this.sharedService.hideSpinner();
          this.sharedService.openSnackBar(Message.errorLoginMsg, 'OK');
        }, 3000);
      }
    }
  }
}
