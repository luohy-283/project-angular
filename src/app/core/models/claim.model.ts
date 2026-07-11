export type TrangThaiHoSo = 'MOI_TIEP_NHAN' | 'DANG_XU_LY' | 'DA_HOAN_THANH';
export type TinhTrangDuyet = 'CHO_DUYET' | 'DA_DUYET';

export interface Claim {
  id: string;
  soHoSo: string;
  tenKhachHang: string;
  soHopDong: string;
  loaiHoSo: 'TTTT' | 'BLT';
  trangThaiHoSo: TrangThaiHoSo;
  tinhTrangDuyet: TinhTrangDuyet;
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
  trangThaiHoSo?: TrangThaiHoSo | null;
  loaiHoSo?: Claim['loaiHoSo'] | null;
  pageIndex: number;
  pageSize: number;
  sort?: string;
}

export interface ClaimListResult {
  items: Claim[];
  total: number;
}
