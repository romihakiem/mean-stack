import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Item } from "../../core/models/models";

@Component({
    selector: "app-item-list",
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="flex h-full flex-col rounded-lg border border-gray-200 bg-white">
            <div class="border-b border-gray-200 p-4">
                <div class="mb-3 flex items-center justify-between">
                    <h2 class="font-semibold text-gray-800">Daftar Item</h2>
                    <button (click)="new.emit()" class="rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-600">+ Tambah</button>
                </div>
                <input
                    [ngModel]="search"
                    (ngModelChange)="searchChange.emit($event)"
                    placeholder="Cari item..."
                    class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
            </div>

            <ul class="flex-1 overflow-y-auto">
                <li *ngIf="items.length === 0" class="p-4 text-center text-sm text-gray-400">Belum ada item</li>
                <li *ngFor="let item of items">
                    <button (click)="select.emit(item)" class="block w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-brand-50" [class.bg-brand-50]="selectedId === item._id">
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-800">{{ item.name }}</span>
                            <span
                                class="rounded-full px-2 py-0.5 text-xs font-medium"
                                [class.bg-green-100]="item.status === 'active'"
                                [class.text-green-700]="item.status === 'active'"
                                [class.bg-gray-100]="item.status !== 'active'"
                                [class.text-gray-500]="item.status !== 'active'"
                            >
                                {{ item.status === "active" ? "Aktif" : "Nonaktif" }}
                            </span>
                        </div>
                        <div class="mt-0.5 text-xs text-gray-500">{{ item.category }} · Stok {{ item.stock }}</div>
                    </button>
                </li>
            </ul>
        </div>
    `,
})
export class ItemListComponent {
    @Input() items: Item[] = [];
    @Input() selectedId: string | null = null;
    @Input() search = "";

    @Output() select = new EventEmitter<Item>();
    @Output() new = new EventEmitter<void>();
    @Output() searchChange = new EventEmitter<string>();
}
