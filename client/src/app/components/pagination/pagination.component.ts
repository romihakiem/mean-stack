import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-pagination",
    standalone: true,
    imports: [CommonModule],
    template: `
        <div *ngIf="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <button
                (click)="pageChange.emit(page - 1)"
                [disabled]="!hasPrevPage"
                class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Sebelumnya
            </button>

            <span class="text-sm text-gray-500">
                Halaman <span class="font-medium text-gray-700">{{ page }}</span> dari
                <span class="font-medium text-gray-700">{{ totalPages }}</span>
            </span>

            <button
                (click)="pageChange.emit(page + 1)"
                [disabled]="!hasNextPage"
                class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Berikutnya
            </button>
        </div>
    `,
})
export class PaginationComponent {
    @Input() page = 1;
    @Input() totalPages = 1;
    @Input() hasPrevPage = false;
    @Input() hasNextPage = false;

    @Output() pageChange = new EventEmitter<number>();
}
