import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Company } from '../../interfaces/company';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  serverUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.serverUrl}company-details`);
  }

  deleteCompanyById(companyId: string): Observable<Company[]> {
    const url = `${this.serverUrl}delete-company/${companyId}`; // Adjust URL according to your API endpoint
    return this.http.delete<Company[]>(url).pipe(
      catchError((error) => {
        return throwError(error); // Rethrow the error to be caught by the caller
      })
    );
  }

  createCompany(payload: any): Observable<any> {
    const url = `${this.serverUrl}add-company`; // Adjust URL according to your API endpoint
    return this.http.post(url, payload).pipe(
      catchError((error) => {
        throw error; // Rethrow the error to be caught by the caller
      })
    );
  }

  updateCompany(companyId: string, payload: any): Observable<any> {
    const url = `${this.serverUrl}update-company/${companyId}`; // Adjust URL according to your API endpoint
    return this.http.put(url, payload).pipe(
      catchError((error) => {
        throw error; // Rethrow the error to be caught by the caller
      })
    );
  }

  getCompanyById(companyId: string): Observable<any> {
    const url = `${this.serverUrl}company-details/${companyId}`; // Adjust URL according to your API endpoint
    return this.http.get(url).pipe(
      catchError((error) => {
        throw error; // Rethrow the error to be caught by the caller
      })
    );
  }
}
