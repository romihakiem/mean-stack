import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Item, ItemForm } from "../../core/models/models";

@Component({
    selector: "app-item-detail",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
        <div *ngIf="!item && !isNew" class="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-sm text-gray-400">
            Pilih item di sebelah kiri, atau klik "+ Tambah" untuk membuat item baru
        </div>

        <div *ngIf="item || isNew" class="h-full rounded-lg border border-gray-200 bg-white">
            <div class="flex items-center justify-between border-b border-gray-200 p-4">
                <h2 class="font-semibold text-gray-800">
                    {{ isNew ? "Item Baru" : "Detail Item" }}
                </h2>
                <button *ngIf="!isNew" (click)="delete.emit(item!._id)" class="text-sm font-medium text-red-500 transition hover:text-red-600">Hapus</button>
            </div>

            <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-4 p-4">
                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-600">Nama</label>
                    <input formControlName="name" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400" />
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-600">Deskripsi</label>
                    <textarea
                        formControlName="description"
                        rows="3"
                        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                    ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="mb-1 block text-sm font-medium text-gray-600">Kategori</label>
                        <input formControlName="category" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium text-gray-600">Status</label>
                        <select formControlName="status" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400">
                            <option value="active">Aktif</option>
                            <option value="inactive">Nonaktif</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="mb-1 block text-sm font-medium text-gray-600">Harga</label>
                        <input
                            type="number"
                            min="0"
                            formControlName="price"
                            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                        />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium text-gray-600">Stok</label>
                        <input
                            type="number"
                            min="0"
                            formControlName="stock"
                            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                        />
                    </div>
                </div>

                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" (click)="cancel.emit()" class="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100">Batal</button>
                    <button type="submit" [disabled]="form.invalid || saving" class="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60">
                        {{ saving ? "Menyimpan..." : "Simpan" }}
                    </button>
                </div>
            </form>
        </div>
    `,
})
export class ItemDetailComponent implements OnChanges {
    @Input() item: Item | null = null;
    @Input() isNew = false;
    @Input() saving = false;

    @Output() save = new EventEmitter<{ form: ItemForm; id?: string }>();
    @Output() delete = new EventEmitter<string>();
    @Output() cancel = new EventEmitter<void>();

    form = this.fb.group({
        name: ["", Validators.required],
        description: [""],
        category: [""],
        price: [0, [Validators.required, Validators.min(0)]],
        stock: [0, [Validators.required, Validators.min(0)]],
        status: ["active" as "active" | "inactive"],
    });

    constructor(private fb: FormBuilder) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["item"] || changes["isNew"]) {
            if (this.item) {
                this.form.patchValue({
                    name: this.item.name,
                    description: this.item.description ?? "",
                    category: this.item.category ?? "",
                    price: this.item.price,
                    stock: this.item.stock,
                    status: this.item.status,
                });
            } else if (this.isNew) {
                this.form.reset({
                    name: "",
                    description: "",
                    category: "",
                    price: 0,
                    stock: 0,
                    status: "active",
                });
            }
        }
    }

    handleSubmit(): void {
        if (this.form.invalid) return;
        this.save.emit({
            form: this.form.getRawValue() as ItemForm,
            id: this.item?._id,
        });
    }
}
