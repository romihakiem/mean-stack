import { Injectable, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthResponse, User } from "../models/models";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly baseUrl = `${environment.apiUrl}/auth`;

    private readonly userSignal = signal<User | null>(this.readStoredUser());
    private readonly loadingSignal = signal<boolean>(false);

    readonly user = computed(() => this.userSignal());
    readonly isAuthenticated = computed(() => !!this.userSignal());
    readonly loading = computed(() => this.loadingSignal());

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}

    private readStoredUser(): User | null {
        const stored = localStorage.getItem("user");
        return stored ? (JSON.parse(stored) as User) : null;
    }

    fetchCurrentUser(): Observable<{ user: User }> {
        return this.http.get<{ user: User }>(`${this.baseUrl}/me`).pipe(tap((res) => this.userSignal.set(res.user)));
    }

    register(name: string, email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/register`, { name, email, password }).pipe(tap((res) => this.persistSession(res)));
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password }).pipe(tap((res) => this.persistSession(res)));
    }

    logout(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.userSignal.set(null);
        this.router.navigate(["/login"]);
    }

    getToken(): string | null {
        return localStorage.getItem("token");
    }

    setLoading(value: boolean): void {
        this.loadingSignal.set(value);
    }

    private persistSession(res: AuthResponse): void {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        this.userSignal.set(res.user);
    }
}
