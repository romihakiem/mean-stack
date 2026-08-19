import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
        <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div class="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <div class="mb-6 text-center">
                    <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-brand-500 font-bold text-white">M</div>
                    <h1 class="text-lg font-semibold text-gray-800">Masuk ke akun Anda</h1>
                </div>

                <div *ngIf="error" class="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                    {{ error }}
                </div>

                <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-4">
                    <div>
                        <label class="mb-1 block text-sm font-medium text-gray-600">Email</label>
                        <input type="email" formControlName="email" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium text-gray-600">Password</label>
                        <input type="password" formControlName="password" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400" />
                    </div>
                    <button type="submit" [disabled]="form.invalid || loading" class="w-full rounded-md bg-brand-500 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60">
                        {{ loading ? "Memproses..." : "Masuk" }}
                    </button>
                </form>

                <p class="mt-4 text-center text-sm text-gray-500">
                    Belum punya akun?
                    <a routerLink="/register" class="font-medium text-brand-500 hover:underline">Daftar</a>
                </p>
            </div>
        </div>
    `,
})
export class LoginComponent {
    form = this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", Validators.required],
    });

    error = "";
    loading = false;

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
    ) {}

    handleSubmit(): void {
        if (this.form.invalid) return;
        this.error = "";
        this.loading = true;
        const { email, password } = this.form.getRawValue();

        this.auth.login(email!, password!).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(["/"]);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.message || "Gagal login";
            },
        });
    }
}
