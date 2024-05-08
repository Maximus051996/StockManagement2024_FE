import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar
  ) {}

  showSpinner() {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }

  hideSpinner() {
    this.spinner.hide();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000, // Duration in milliseconds
      horizontalPosition: 'center', // Horizontal position
      verticalPosition: 'bottom', // Vertical position
    });
  }
}
