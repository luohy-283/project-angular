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
