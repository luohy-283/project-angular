export interface Claim {
  id: string;
  soHoSo: string;
  tenKhachHang: string;
  soHopDong: string;
  loaiHoSo: 'TTTT' | 'BLT';
  trangThaiHoSo: string;
  tinhTrangDuyet: string;
  soTienYeuCau: number;
  soTienDuyet: number;
  ngayNhanHoSo: string;
  ngayDuyet?: string | null;
}

export interface ClaimListResponse {
  items: Claim[];
  total: number;
}

export interface ClaimQueryParams {
  keyword?: string;
  status?: Claim['trangThaiHoSo'] | null;
  type?: Claim['loaiHoSo'] | null;
  pageIndex: number;
  pageSize: number;
}

export interface ClaimListResult {
  items: Claim[];
  total: number;
}
