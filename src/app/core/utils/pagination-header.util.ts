import { HttpHeaders } from '@angular/common/http';

const TOTAL_COUNT_HEADER_NAMES = ['X-Total-Count', 'x-total-count'];

export function getPaginationTotal(headers: HttpHeaders): number | null {
  for (const headerName of TOTAL_COUNT_HEADER_NAMES) {
    const value = headers.get(headerName);
    if (value == null || value === '') {
      continue;
    }

    const total = Number(value);
    if (!Number.isNaN(total) && total >= 0) {
      return total;
    }
  }

  return null;
}
