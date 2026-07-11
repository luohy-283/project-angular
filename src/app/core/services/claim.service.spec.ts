import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Claim } from '../models/claim.model';
import { ClaimService } from './claim.service';

describe('ClaimService', () => {
  let service: ClaimService;
  let httpMock: HttpTestingController;

  const mockClaims: Claim[] = [
    {
      id: '1',
      soHoSo: 'BT-2026-0001',
      tenKhachHang: 'Nguyen Van An',
      soHopDong: 'HD-2026-001',
      loaiHoSo: 'TTTT',
      trangThaiHoSo: 'DANG_XU_LY',
      tinhTrangDuyet: 'CHO_DUYET',
      soTienYeuCau: 3500000,
      soTienDuyet: 2800000,
      ngayNhanHoSo: '2026-07-01',
      ngayDuyet: null,
    },
    {
      id: '2',
      soHoSo: 'BT-2026-0002',
      tenKhachHang: 'Tran Thi Binh',
      soHopDong: 'HD-2026-002',
      loaiHoSo: 'BLT',
      trangThaiHoSo: 'DA_HOAN_THANH',
      tinhTrangDuyet: 'DA_DUYET',
      soTienYeuCau: 4800000,
      soTienDuyet: 4800000,
      ngayNhanHoSo: '2026-07-02',
      ngayDuyet: '2026-07-03',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ClaimService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load claims list successfully', async () => {
    const resultPromise = firstValueFrom(service.getClaimsList({ pageIndex: 0, pageSize: 2 }));

    const request = httpMock.expectOne((req) => req.url === `${environment.apiUrl}/claims`);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('0');
    expect(request.request.params.get('size')).toBe('2');
    request.flush(mockClaims, { headers: { 'X-Total-Count': '2' } });

    const result = await resultPromise;

    expect(result.items).toEqual(mockClaims);
    expect(result.total).toBe(2);
  });

  it('should pass filter params to the claims API', async () => {
    const resultPromise = firstValueFrom(
      service.getClaimsList({
        keyword: 'cuong',
        trangThaiHoSo: 'DANG_XU_LY',
        loaiHoSo: 'TTTT',
        pageIndex: 0,
        pageSize: 10,
      }),
    );

    const request = httpMock.expectOne((req) => req.url === `${environment.apiUrl}/claims`);
    expect(request.request.params.get('keyword')).toBe('cuong');
    expect(request.request.params.get('trangThaiHoSo')).toBe('DANG_XU_LY');
    expect(request.request.params.get('loaiHoSo')).toBe('TTTT');
    request.flush([mockClaims[0]], { headers: { 'X-Total-Count': '1' } });

    const result = await resultPromise;

    expect(result.items).toEqual([mockClaims[0]]);
    expect(result.total).toBe(1);
  });

  it('should return an error when claims data cannot be loaded', async () => {
    const resultPromise = firstValueFrom(service.getClaimsList({ pageIndex: 0, pageSize: 10 }));

    const request = httpMock.expectOne((req) => req.url === `${environment.apiUrl}/claims`);
    request.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    await expectAsync(resultPromise).toBeRejected();
  });
});
