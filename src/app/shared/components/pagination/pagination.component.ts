import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() length = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 50];

  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();

  onPageChange(event: PageEvent): void {
    this.pageChange.emit({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }
}
