import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { Claim } from '../models/claim.model';
import { ClaimService } from './claim.service';

describe('ClaimService', () => {
  let service: ClaimService;
  let httpMock: HttpTestingController;

  const mockClaims: Claim[] = [
    {
      id: 'HSBT001',
      soHoSo: 'BT-2026-0001',
      tenKhachHang: 'Nguyen Van An',
      soHopDong: 'HD-2026-001',
      loaiHoSo: 'TTTT',
      trangThaiHoSo: 'Processing',
      tinhTrangDuyet: 'Pending',
      soTienYeuCau: 3500000,
      soTienDuyet: 2800000,
      ngayNhanHoSo: '2026-07-01',
      ngayDuyet: null,
    },
    {
      id: 'HSBT002',
      soHoSo: 'BT-2026-0002',
      tenKhachHang: 'Tran Thi Binh',
      soHopDong: 'HD-2026-002',
      loaiHoSo: 'BLT',
      trangThaiHoSo: 'Completed',
      tinhTrangDuyet: 'Approved',
      soTienYeuCau: 4800000,
      soTienDuyet: 4800000,
      ngayNhanHoSo: '2026-07-02',
      ngayDuyet: '2026-07-03',
    },
    {
      id: 'HSBT003',
      soHoSo: 'BT-2026-0003',
      tenKhachHang: 'Le Minh Cuong',
      soHopDong: 'HD-2026-003',
      loaiHoSo: 'TTTT',
      trangThaiHoSo: 'Processing',
      tinhTrangDuyet: 'Pending',
      soTienYeuCau: 2200000,
      soTienDuyet: 1800000,
      ngayNhanHoSo: '2026-07-04',
      ngayDuyet: null,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ClaimService);
    httpMock = TestBed.inject(HttpTestingController);
    window.localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    window.localStorage.clear();
  });

  it('should load claims list successfully', async () => {
    const resultPromise = firstValueFrom(service.getClaimsList({ pageIndex: 0, pageSize: 2 }));

    const request = httpMock.expectOne('assets/mock-data/claims.json');
    expect(request.request.method).toBe('GET');
    request.flush({ items: mockClaims, total: mockClaims.length });

    const result = await resultPromise;

    expect(result.items).toEqual(mockClaims.slice(0, 2));
    expect(result.total).toBe(3);
  });

  it('should filter claims by keyword, status, and type', async () => {
    const resultPromise = firstValueFrom(
      service.getClaimsList({
        keyword: 'cuong',
        status: 'Processing',
        type: 'TTTT',
        pageIndex: 0,
        pageSize: 10,
      }),
    );

    const request = httpMock.expectOne('assets/mock-data/claims.json');
    request.flush({ items: mockClaims, total: mockClaims.length });

    const result = await resultPromise;

    expect(result.items).toEqual([mockClaims[2]]);
    expect(result.total).toBe(1);
  });

  it('should return an error when claims data cannot be loaded', async () => {
    const resultPromise = firstValueFrom(service.getClaimsList({ pageIndex: 0, pageSize: 10 }));

    const request = httpMock.expectOne('assets/mock-data/claims.json');
    request.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    await expectAsync(resultPromise).toBeRejected();
  });
});
