import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
import { LayoutComponent } from "../../components/layout/layout.component";
import { ItemListComponent } from "../../components/item-list/item-list.component";
import { ItemDetailComponent } from "../../components/item-detail/item-detail.component";
import { ItemService } from "../../core/services/item.service";
import { Item, ItemForm } from "../../core/models/models";

@Component({
    selector: "app-dashboard",
    standalone: true,
    imports: [CommonModule, LayoutComponent, ItemListComponent, ItemDetailComponent],
    template: `
        <app-layout>
            <div class="mb-6">
                <h1 class="text-xl font-semibold text-gray-800">Dashboard Item</h1>
                <p class="text-sm text-gray-500">Kelola data item Anda — pilih dari daftar untuk melihat detail.</p>
            </div>

            <div *ngIf="error" class="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {{ error }}
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-[360px_1fr]" style="min-height: 60vh">
                <app-item-list [items]="items" [selectedId]="selected?._id ?? null" [search]="search" (select)="handleSelect($event)" (new)="handleNew()" (searchChange)="handleSearchChange($event)"></app-item-list>

                <app-item-detail [item]="selected" [isNew]="isNew" [saving]="saving" (save)="handleSave($event)" (delete)="handleDelete($event)" (cancel)="handleCancel()"></app-item-detail>
            </div>

            <p *ngIf="loading" class="mt-4 text-center text-sm text-gray-400">Memuat data...</p>
        </app-layout>
    `,
})
export class DashboardComponent implements OnInit {
    items: Item[] = [];
    selected: Item | null = null;
    isNew = false;
    search = "";
    loading = true;
    saving = false;
    error = "";

    private searchSubject = new Subject<string>();

    constructor(private itemService: ItemService) {}

    ngOnInit(): void {
        this.fetchItems();

        this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((q) => {
            this.fetchItems(q);
        });
    }

    fetchItems(query = ""): void {
        this.loading = true;
        this.itemService.getItems(query).subscribe({
            next: (res) => {
                this.items = res.items;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.error?.message || "Gagal memuat data";
                this.loading = false;
            },
        });
    }

    handleSearchChange(value: string): void {
        this.search = value;
        this.searchSubject.next(value);
    }

    handleSelect(item: Item): void {
        this.selected = item;
        this.isNew = false;
    }

    handleNew(): void {
        this.selected = null;
        this.isNew = true;
    }

    handleCancel(): void {
        this.selected = null;
        this.isNew = false;
    }

    handleSave({ form, id }: { form: ItemForm; id?: string }): void {
        this.saving = true;
        const request = id ? this.itemService.updateItem(id, form) : this.itemService.createItem(form);

        request.subscribe({
            next: (res) => {
                if (id) {
                    this.items = this.items.map((it) => (it._id === id ? res.item : it));
                } else {
                    this.items = [res.item, ...this.items];
                    this.isNew = false;
                }
                this.selected = res.item;
                this.saving = false;
            },
            error: (err) => {
                this.error = err.error?.message || "Gagal menyimpan item";
                this.saving = false;
            },
        });
    }

    handleDelete(id: string): void {
        if (!confirm("Yakin ingin menghapus item ini?")) return;
        this.itemService.deleteItem(id).subscribe({
            next: () => {
                this.items = this.items.filter((it) => it._id !== id);
                this.selected = null;
            },
            error: (err) => {
                this.error = err.error?.message || "Gagal menghapus item";
            },
        });
    }
}
