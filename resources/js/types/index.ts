// Define common types used across the application

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PageProps {
    auth: {
        user: User;
    };
    [key: string]: any;
}
