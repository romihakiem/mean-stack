import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Item, ItemForm } from "../models/models";

@Injectable({ providedIn: "root" })
export class ItemService {
    private readonly baseUrl = `${environment.apiUrl}/items`;

    constructor(private http: HttpClient) {}

    getItems(search = ""): Observable<{ items: Item[]; total: number }> {
        const params = search ? { search } : {};
        return this.http.get<{ items: Item[]; total: number }>(this.baseUrl, {
            params,
        });
    }

    getItem(id: string): Observable<{ item: Item }> {
        return this.http.get<{ item: Item }>(`${this.baseUrl}/${id}`);
    }

    createItem(form: ItemForm): Observable<{ item: Item }> {
        return this.http.post<{ item: Item }>(this.baseUrl, form);
    }

    updateItem(id: string, form: ItemForm): Observable<{ item: Item }> {
        return this.http.put<{ item: Item }>(`${this.baseUrl}/${id}`, form);
    }

    deleteItem(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    }
}
