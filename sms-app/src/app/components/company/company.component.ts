import { Component, OnInit, ViewChild } from '@angular/core';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../core/services/company/company.service';
import { Router } from '@angular/router';
import { SharedService } from '../../core/services/shared/shared.service';
import { Message } from '../../core/constants/messages';
@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent implements OnInit {
  companies!: any[];
  filteredCompanies!: any[];
  loading: boolean = true;
  @ViewChild('dt') table!: Table;
  constructor(
    private companyService: CompanyService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getCompanyDetails();
  }

  getCompanyDetails() {
    this.companyService.getAllCompanies().subscribe(
      (companies) => {
        this.companies = companies;
        this.filteredCompanies = companies;
        this.loading = false;
      },
      (error) => {
        this.sharedService.openSnackBar(Message.errorMsg, 'OK');
        throw error;
        // Handle error
      }
    );
  }

  searchValue(targetValue: any): void {
    let searchTerm = targetValue.value;
    this.companies = this.companies.filter((company) =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If search term is empty, reset filteredCompanies to the original list
    if (!searchTerm) {
      this.companies = this.filteredCompanies;
    }

    // Update the table with the filtered data
    this.table.filterGlobal(searchTerm, 'contains');
  }

  selectDataById(rowDataId: any) {
    this.router.navigate([`ins/edit-company/${rowDataId}`]);
  }

  deleteDataById(rowDataId: any) {
    this.loading = true;
    this.companyService.deleteCompanyById(rowDataId).subscribe(
      (responseData: any) => {
        this.companies = responseData.companies;
        this.loading = false;
        this.sharedService.openSnackBar(responseData.message, 'OK');
      },
      (error) => {
        this.sharedService.openSnackBar(Message.errorAddeditdeleteMsg, 'OK');
        throw error;
      }
    );
  }

  AddRecord() {
    this.router.navigate([`ins/add-company`]);
  }
}
