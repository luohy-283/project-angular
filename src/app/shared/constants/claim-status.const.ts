export const TRANG_THAI_LABEL: Record<string, string> = {
  MOI_TIEP_NHAN: 'Mới tiếp nhận',
  DANG_XU_LY: 'Đang xử lý',
  DA_HOAN_THANH: 'Đã hoàn thành',
};

export const TINH_TRANG_DUYET_LABEL: Record<string, string> = {
  CHO_DUYET: 'Chờ duyệt',
  DA_DUYET: 'Đã duyệt',
};

export const TRANG_THAI_OPTIONS = Object.keys(TRANG_THAI_LABEL);
export const TINH_TRANG_DUYET_OPTIONS = Object.keys(TINH_TRANG_DUYET_LABEL);
