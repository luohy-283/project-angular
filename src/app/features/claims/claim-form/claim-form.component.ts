import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Claim, TinhTrangDuyet, TrangThaiHoSo } from '../../../core/models/claim.model';
import { ClaimPayload } from '../../../core/services/claim.service';
import {
  TINH_TRANG_DUYET_LABEL,
  TINH_TRANG_DUYET_OPTIONS,
  TRANG_THAI_LABEL,
  TRANG_THAI_OPTIONS,
} from '../../../shared/constants/claim-status.const';

export type ClaimFormValue = Omit<Claim, 'id'> & {
  maCskcb?: string;
  tenCskcb?: string;
  phuongThucNhanHs?: string;
  ngayDuyet?: string | null;
};

function amountComparisonValidator(control: AbstractControl): ValidationErrors | null {
  const soTienYeuCau = Number(control.get('soTienYeuCau')?.value);
  const soTienDuyet = Number(control.get('soTienDuyet')?.value);

  if (!Number.isFinite(soTienYeuCau) || !Number.isFinite(soTienDuyet)) {
    return null;
  }

  return soTienDuyet > soTienYeuCau ? { amountExceeded: true } : null;
}

@Component({
  selector: 'app-claim-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './claim-form.component.html',
  styleUrl: './claim-form.component.scss',
})
export class ClaimFormComponent implements OnChanges {
  @Input() initialValue?: Claim | ClaimPayload;
  @Output() formSubmit = new EventEmitter<ClaimFormValue>();
  @Output() formCancel = new EventEmitter<void>();

  readonly claimForm = new FormGroup(
    {
      soHoSo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      tenKhachHang: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      soHopDong: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      loaiHoSo: new FormControl<'TTTT' | 'BLT'>('TTTT', { nonNullable: true, validators: [Validators.required] }),
      maCskcb: new FormControl('', { nonNullable: true }),
      tenCskcb: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      phuongThucNhanHs: new FormControl('', { nonNullable: true }),
      ngayNhanHoSo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      soTienYeuCau: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
      soTienDuyet: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
      trangThaiHoSo: new FormControl<TrangThaiHoSo>('MOI_TIEP_NHAN', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      tinhTrangDuyet: new FormControl<TinhTrangDuyet>('CHO_DUYET', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: amountComparisonValidator },
  );

  readonly claimTypes: ('TTTT' | 'BLT')[] = ['TTTT', 'BLT'];
  readonly trangThaiOptions = TRANG_THAI_OPTIONS;
  readonly trangThaiLabel = TRANG_THAI_LABEL;
  readonly tinhTrangDuyetOptions = TINH_TRANG_DUYET_OPTIONS;
  readonly tinhTrangDuyetLabel = TINH_TRANG_DUYET_LABEL;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['initialValue']) {
      return;
    }

    if (this.initialValue) {
      const initialClaim = this.initialValue as Claim & { maCskcb?: string; tenCskcb?: string; phuongThucNhanHs?: string };
      this.claimForm.reset();
      this.claimForm.patchValue({
        soHoSo: this.initialValue.soHoSo ?? '',
        tenKhachHang: this.initialValue.tenKhachHang ?? '',
        soHopDong: this.initialValue.soHopDong ?? '',
        loaiHoSo: (this.initialValue.loaiHoSo as 'TTTT' | 'BLT') ?? 'TTTT',
        maCskcb: initialClaim.maCskcb ?? '',
        tenCskcb: initialClaim.tenCskcb ?? '',
        phuongThucNhanHs: initialClaim.phuongThucNhanHs ?? '',
        ngayNhanHoSo: this.initialValue.ngayNhanHoSo ?? '',
        soTienYeuCau: this.initialValue.soTienYeuCau ?? null,
        soTienDuyet: this.initialValue.soTienDuyet ?? null,
        trangThaiHoSo: this.initialValue.trangThaiHoSo ?? 'MOI_TIEP_NHAN',
        tinhTrangDuyet: this.initialValue.tinhTrangDuyet ?? 'CHO_DUYET',
      });
      return;
    }

    this.claimForm.reset();
  }

  onSubmit(): void {
    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched();
      return;
    }

    const formValue = this.claimForm.getRawValue() as ClaimFormValue;
    this.formSubmit.emit({
      ...formValue,
      ngayDuyet: null,
    });
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  getControl(controlName: string): FormControl {
    return this.claimForm.get(controlName) as FormControl;
  }

  getErrorMessage(controlName: string): string {
    const control = this.getControl(controlName);

    if (control.hasError('required')) {
      return 'Thông tin này là bắt buộc.';
    }

    if (controlName === 'soTienYeuCau' && control.hasError('min')) {
      return 'Số tiền yêu cầu phải lớn hơn 0.';
    }

    if (controlName === 'soTienDuyet' && control.hasError('min')) {
      return 'Số tiền duyệt không được nhỏ hơn 0.';
    }

    if (control.hasError('pattern')) {
      return 'Định dạng ngày không hợp lệ.';
    }

    return 'Thông tin không hợp lệ.';
  }

  getAmountErrorMessage(): string {
    return this.claimForm.hasError('amountExceeded') ? 'Số tiền duyệt không được lớn hơn số tiền yêu cầu.' : 'Thông tin không hợp lệ.';
  }
}
