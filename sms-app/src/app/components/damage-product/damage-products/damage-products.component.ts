import { Component, ViewChild } from '@angular/core';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { MessagesModule } from 'primeng/messages';
import { Message } from '../../../core/constants/messages';
import { SharedService } from '../../../core/services/shared/shared.service';
import { ProductService } from '../../../core/services/product/product.service';
import { CompanyService } from '../../../core/services/company/company.service';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-damage-products',
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
    TagModule,
  ],
  templateUrl: './damage-products.component.html',
  styleUrl: './damage-products.component.scss',
})
export class DamageProductsComponent {
  damageDetails!: any[];
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  messages: any;
  filteredDamageDetails!: any[];
  loading: boolean = false;
  companyDetails!: any;
  productDetails!: any;
  constructor(
    private productService: ProductService,
    private companyService: CompanyService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.fetchData();
    this.messages = [
      {
        severity: 'info',
        detail: `Please search by Company Name or Product Name if required .`,
      },
    ];
  }

  fetchData(): void {
    this.loading = true;
    Promise.all([
      this.getCompanyDetails(),
      this.getproductDetails(),
      this.getdamageProductDetails(),
    ])
      .then(() => {
        this.enrichDamageDetails();
        this.loading = false;
      })
      .catch((error) => {
        this.sharedService.openSnackBar(Message.errorMsg, 'OK');
        throw error;
      });
  }

  getCompanyDetails(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.companyService.getAllCompanies().subscribe(
        (companies) => {
          this.companyDetails = companies;
          resolve(companies);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getproductDetails(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.productService.getAllproducts().subscribe(
        (products) => {
          this.productDetails = products;
          resolve(products);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getdamageProductDetails(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.productService.getAlldamageproducts().subscribe(
        (damageProducts) => {
          this.damageDetails = damageProducts;
          resolve(damageProducts);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  enrichDamageDetails(): void {
    this.damageDetails = this.damageDetails.map((damageProduct) => {
      const company = this.companyDetails.find(
        (company: any) => company.companyId === damageProduct.companyId
      );
      const product = this.productDetails.find(
        (product: any) => product.productId === damageProduct.productId
      );
      return {
        ...damageProduct,
        companyName: company ? company.companyName : 'Unknown Company',
        productName: product ? product.productName : 'Unknown Product',
      };
    });
    this.filteredDamageDetails = this.damageDetails;
  }

  deleteDataById(rowDataId: any) {
    this.loading = true;
    this.productService.deletedamageProductById(rowDataId).subscribe(
      (responseData: any) => {
        this.fetchData();
        this.loading = false;
        this.sharedService.openSnackBar(responseData.message, 'OK');
      },
      (error) => {
        this.sharedService.openSnackBar(Message.errorAddeditdeleteMsg, 'OK');
        throw error;
      }
    );
  }

  selectDataById(rowDataId: any) {
    this.router.navigate([`ins/edit-damage-details/${rowDataId}`]);
  }

  AddRecord() {
    this.router.navigate([`ins/add-damage-details`]);
  }

  searchValue(targetValue: any): void {
    let searchTerm = targetValue.value.toLowerCase();
    if (!searchTerm) {
      this.damageDetails = [...this.filteredDamageDetails];
    } else {
      this.damageDetails = this.filteredDamageDetails.filter(
        (result) =>
          result.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  exportData() {
    try {
      this.exportToExcel(this.damageDetails);
    } catch (err) {
      throw err;
    }
  }

  private async exportToExcel(damageproductDetails: any[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('damageproducts');

    // Define header row
    worksheet.columns = [
      { header: 'Company Name', key: 'companyName', width: 30 },
      { header: 'Product Name', key: 'productName', width: 60 },
      { header: 'Quantity', key: 'quantity', width: 30 },
      { header: 'MRP', key: 'mrp', width: 30 },
      { header: 'Date Of Expiry', key: 'dOExpiry', width: 30 },
    ];

    damageproductDetails.forEach((data) => {
      const expiryDate = new Date(data.dOExpiry);
      const expiryFormatted = expiryDate.toLocaleString('default', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      worksheet.addRow({
        companyName: data.companyName,
        productName: data.productName,
        quantity: data.quantity,
        mrp: data.mrp,
        dOExpiry: expiryFormatted,
      });
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
    link.download = `damageproductDetails_${timestamp}.xlsx`;
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
  }

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
        if (
          header[0] === 'Company Name' &&
          header[1] === 'Product Name' &&
          header[2] === 'Quantity' &&
          header[3] === 'MRP' &&
          header[4] === 'Date Of Expiry'
        ) {
          resultData = data.slice(1).map((row: any) => ({
            companyName: row[0],
            productName: row[1],
            quantity: row[2],
            mrp: row[3],
            dOExpiry: this.convertToISODate(row[4]),
          }));
          this.productService
            .importdamageProducts(resultData)
            .subscribe((response) => {
              this.sharedService.openSnackBar(response.message, 'OK');
              this.fileUpload.clear();
              this.fetchData();
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

  convertToISODate(dateString: string): string {
    // Create a Date object from the input string
    const date = new Date(dateString);

    // Ensure the date is valid
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dateString}`);
    }

    // Get the components of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    const day = String(date.getDate()).padStart(2, '0');

    // Construct the ISO string
    const isoDateString = `${year}-${month}-${day}T18:30:00.000+00:00`;

    return isoDateString;
  }
}
