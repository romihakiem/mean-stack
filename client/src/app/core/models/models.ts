export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Item {
    _id: string;
    name: string;
    description?: string;
    category?: string;
    price: number;
    stock: number;
    status: "active" | "inactive";
    owner?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type ItemForm = Omit<Item, "_id" | "owner" | "createdAt" | "updatedAt">;

export interface PaginatedItems {
    items: Item[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
}
