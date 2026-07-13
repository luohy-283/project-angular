import { TinhTrangDuyet, TrangThaiHoSo } from '../models/claim.model';
import { TINH_TRANG_DUYET_LABEL, TRANG_THAI_LABEL } from '../../shared/constants/claim-status.const';

export function getTrangThaiLabel(status: TrangThaiHoSo): string {
  return TRANG_THAI_LABEL[status] ?? status;
}

export function getTinhTrangDuyetLabel(status: TinhTrangDuyet): string {
  return TINH_TRANG_DUYET_LABEL[status] ?? status;
}
