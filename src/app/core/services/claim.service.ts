import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClaimListResponse } from '../models/claim.model';

@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  private readonly http = inject(HttpClient);

  getClaims(): Observable<ClaimListResponse> {
    return this.http.get<ClaimListResponse>('assets/mock-data/claims.json');
  }
}
