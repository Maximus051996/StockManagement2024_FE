import { Component, OnInit, ViewChild } from '@angular/core';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../core/services/company/company.service';
import { Router } from '@angular/router';
import { SharedService } from '../../core/services/shared/shared.service';
import { Message } from '../../core/constants/messages';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { MessagesModule } from 'primeng/messages';
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
    FileUploadModule,
    MessagesModule,
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent implements OnInit {
  companies!: any[];
  messages: any;
  filteredCompanies!: any[];
  loading: boolean = true;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  constructor(
    private companyService: CompanyService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.getCompanyDetails();
    this.messages = [
      {
        severity: 'info',
        detail: `Please search by Company Name if required .`,
      },
    ];
  }

  ngOnInit(): void {}

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
      }
    );
  }

  searchValue(targetValue: any): void {
    let searchTerm = targetValue.value.toLowerCase();
    if (!searchTerm) {
      this.companies = [...this.filteredCompanies];
    } else {
      this.companies = this.filteredCompanies.filter((result) =>
        result.companyName.toLowerCase().includes(searchTerm)
      );
    }
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

  exportData() {
    try {
      this.exportToExcel(this.companies);
    } catch (err) {
      throw err;
    }
  }

  private async exportToExcel(companies: any[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Companies');

    // Define header row
    worksheet.columns = [
      { header: 'Company Name', key: 'companyName', width: 30 },
    ];

    // Add rows
    companies.forEach((company) => {
      worksheet.addRow({ companyName: company.companyName });
    });

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
      };
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      };
      cell.font = { bold: true };
    });

    // Style data cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        if (rowNumber !== 1) {
          // Skip header row
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } },
          };
        }
      });
    });

    // Generate buffer and create a blob
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Create download link and trigger download

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    let timestamp = this.sharedService.gettimeStamp();
    link.download = `company_${timestamp}.xlsx`;
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
  }

  // processExcelData(data: any[]) {
  //   const headers = data[0];
  //   const companyNameIndex = headers.indexOf('Company Name');

  //   if (companyNameIndex === -1) {
  //     this.sharedService.openSnackBar(Message.noDataFound, 'OK');
  //     return;
  //   }

  //   this.companies = data.slice(1).map((row) => ({
  //     companyName: row[companyNameIndex],
  //   }));
  // }

  onFileSelect(event: any) {
    this.loading = true;
    const file = event.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Process the data
      let resultData: any;
      // Convert to JSON format
      if (data.length > 0) {
        const header: any = data[0];
        if (header[0] === 'Company Name') {
          resultData = data.slice(1).map((row: any) => ({
            companyName: row[0],
          }));
          this.companyService
            .importCompanies(resultData)
            .subscribe((response) => {
              this.sharedService.openSnackBar(response.message, 'OK');
              this.fileUpload.clear();
              this.getCompanyDetails();
              this.loading = false;
            });
        } else {
          this.sharedService.openSnackBar(
            `${Message.excelHeadererror} : ${header}`,
            'OK'
          );
        }
      }
    };
    reader.readAsBinaryString(file);
  }
}
