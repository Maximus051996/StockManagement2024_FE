import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyService } from '../../../../../core/services/company/company.service';
import { SharedService } from '../../../../../core/services/shared/shared.service';
import { Message } from '../../../../../core/constants/messages';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-addeditcompany',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    ButtonModule,
    NgxSpinnerModule,
  ],
  templateUrl: './addeditcompany.component.html',
  styleUrl: './addeditcompany.component.scss',
})
export class AddeditcompanyComponent implements OnInit {
  addeditForm!: FormGroup;
  isEdit = false; // Flag to check if it's edit mode
  companyId: string | undefined; // Variable to store company ID during edit
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.assignInitialValue();
  }

  cancel(): void {
    this.addeditForm.reset();
    this.router.navigate(['/ins/company']);
  }

  assignInitialValue() {
    this.addeditForm = this.fb.group({
      companyName: ['', Validators.required],
    });
    // Check if it's edit mode and patch the form with existing data
    if (this.router.url.includes('edit')) {
      this.isEdit = true;
      const segments = this.router.url.split('/');
      this.companyId = segments[segments.length - 1]; // Get company ID from URL
      this.patchFormData(); // Patch form with existing data
    }
  }

  patchFormData() {
    // Fetch existing company data by ID and patch form with it
    if (this.companyId) {
      this.companyService.getCompanyById(this.companyId).subscribe(
        (company) => {
          this.addeditForm.patchValue({
            companyName: company.companyName,
          });
        },
        () => {
          this.sharedService.openSnackBar(Message.errorMsg, 'OK');
        }
      );
    }
  }

  saveCompany() {
    if (this.addeditForm.valid) {
      this.sharedService.showSpinner();
      if (this.isEdit && this.companyId) {
        // Update existing company
        this.companyService
          .updateCompany(this.companyId, this.addeditForm.value)
          .subscribe(
            (res) => {
              this.sharedService.openSnackBar(res.message, 'OK');
              this.router.navigate(['/ins/company']);
              this.sharedService.hideSpinner();
            },
            (error) => {
              this.sharedService.openSnackBar(
                Message.errorAddeditdeleteMsg,
                'OK'
              );
            }
          );
      } else {
        // Add new company
        this.companyService.createCompany(this.addeditForm.value).subscribe(
          (res) => {
            this.sharedService.openSnackBar(res.message, 'OK');
            if (!res.isdublicate) {
              this.router.navigate(['/ins/company']);
            }
            this.sharedService.hideSpinner();
          },
          (error) => {
            this.sharedService.openSnackBar(
              Message.errorAddeditdeleteMsg,
              'OK'
            );
          }
        );
      }
    }
  }
}
