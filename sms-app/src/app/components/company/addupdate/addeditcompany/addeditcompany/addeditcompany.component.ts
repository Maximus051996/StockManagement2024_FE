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
  isEdit = false;
  companyId: string | undefined;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private sharedService: SharedService
  ) {
    this.assignInitialValue();
  }

  ngOnInit(): void {}

  cancel(): void {
    this.addeditForm.reset();
    this.router.navigate(['/ins/company']);
  }

  assignInitialValue() {
    this.addeditForm = this.fb.group({
      companyName: ['', Validators.required],
    });
    if (this.router.url.includes('edit')) {
      this.sharedService.showSpinner();
      this.isEdit = true;
      const segments = this.router.url.split('/');
      this.companyId = segments[segments.length - 1];
      this.patchFormData();
    }
  }

  patchFormData() {
    if (this.companyId) {
      this.companyService.getCompanyById(this.companyId).subscribe(
        (company) => {
          this.addeditForm.patchValue({
            companyName: company.companyName,
          });
          this.sharedService.hideSpinner();
        },
        (error) => {
          this.sharedService.hideSpinner();
          this.sharedService.openSnackBar(Message.errorMsg, 'OK');
          throw error;
        }
      );
    }
  }

  saveCompany() {
    if (this.addeditForm.valid) {
      this.sharedService.showSpinner();
      const companyData = this.addeditForm.value;

      const saveObservable =
        this.isEdit && this.companyId
          ? this.companyService.updateCompany(this.companyId, companyData)
          : this.companyService.createCompany(companyData);

      saveObservable.subscribe(
        (res) => {
          this.sharedService.openSnackBar(res.message, 'OK');
          if (!this.isEdit || !res.isdublicate) {
            this.router.navigate(['/ins/company']);
          }
          this.sharedService.hideSpinner();
        },
        (error) => {
          this.sharedService.openSnackBar(Message.errorAddeditdeleteMsg, 'OK');
          this.sharedService.hideSpinner();
          throw error;
        }
      );
    }
  }
}
