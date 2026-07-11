import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Claim, ClaimListResult, ClaimQueryParams } from '../models/claim.model';

export type ClaimPayload = Omit<Claim, 'id'> & {
  id: string;
  maCskcb?: string;
  tenCskcb?: string;
  phuongThucNhanHs?: string;
  ngayDuyet?: string | null;
};

export type ClaimCreatePayload = Omit<ClaimPayload, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  private readonly http = inject(HttpClient);
  private readonly claimsUrl = `${environment.apiUrl}/claims`;

  getClaimsList(params: ClaimQueryParams): Observable<ClaimListResult> {
    const safePageIndex = Math.max(0, Math.floor(params.pageIndex));
    const safePageSize = Math.max(1, Math.floor(params.pageSize));

    let httpParams = new HttpParams()
      .set('page', String(safePageIndex))
      .set('size', String(safePageSize));

    const keyword = params.keyword?.trim();
    if (keyword) {
      httpParams = httpParams.set('keyword', keyword);
    }

    if (params.trangThaiHoSo) {
      httpParams = httpParams.set('trangThaiHoSo', params.trangThaiHoSo);
    }

    if (params.loaiHoSo) {
      httpParams = httpParams.set('loaiHoSo', params.loaiHoSo);
    }

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    return this.http
      .get<Claim[]>(this.claimsUrl, {
        params: httpParams,
        observe: 'response',
      })
      .pipe(
        map((response) => ({
          items: response.body ?? [],
          total: Number(response.headers.get('X-Total-Count') ?? (response.body?.length ?? 0)),
        })),
      );
  }

  getById(id: string): Observable<ClaimPayload | null> {
    return this.http.get<ClaimPayload>(`${this.claimsUrl}/${id}`).pipe(map((claim) => claim ?? null));
  }

  create(claim: ClaimCreatePayload): Observable<ClaimPayload> {
    return this.http.post<ClaimPayload>(this.claimsUrl, claim);
  }

  update(id: string, claim: Partial<ClaimPayload>): Observable<ClaimPayload> {
    return this.http.put<ClaimPayload>(`${this.claimsUrl}/${id}`, claim);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.claimsUrl}/${id}`);
  }
}
