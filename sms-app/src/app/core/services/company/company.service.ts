import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Company } from '../../interfaces/company';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Message } from '../../constants/messages';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  serverUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<Company[]> {
    return this.http
      .get<Company[]>(`${this.serverUrl}company-details`)
      .pipe(catchError(this.handleError));
  }

  deleteCompanyById(companyId: string): Observable<Company[]> {
    const url = `${this.serverUrl}delete-company/${companyId}`;
    return this.http.delete<Company[]>(url).pipe(catchError(this.handleError));
  }

  createCompany(payload: any): Observable<any> {
    const url = `${this.serverUrl}add-company`;
    return this.http.post(url, payload).pipe(catchError(this.handleError));
  }

  updateCompany(companyId: string, payload: any): Observable<any> {
    const url = `${this.serverUrl}update-company/${companyId}`;
    return this.http.put(url, payload).pipe(catchError(this.handleError));
  }

  getCompanyById(companyId: string): Observable<any> {
    const url = `${this.serverUrl}company-details/${companyId}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  importCompanies(payload: any[]): Observable<any> {
    return this.http
      .post(`${this.serverUrl}import-companies`, payload)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(Message.errorMsg));
  }
}
