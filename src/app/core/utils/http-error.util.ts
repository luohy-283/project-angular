import { HttpErrorResponse } from '@angular/common/http';

export function getHttpErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const detail = error.error?.detail ?? error.error?.message;
    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }

    if (error.status === 0) {
      return 'Không thể kết nối tới máy chủ.';
    }

    if (error.status === 403) {
      return 'Bạn không có quyền thực hiện thao tác này.';
    }

    if (error.status >= 500) {
      return 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.';
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
