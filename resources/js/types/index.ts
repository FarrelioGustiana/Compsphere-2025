// Define common types used across the application

export interface AdminProfile {
    user_id: number;
    admin_level: number;
}

// Re-export all types from models.ts
export * from './models';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    role: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
    adminProfile?: AdminProfile;
}

export interface PageProps {
    auth: {
        user: User;
    };
    [key: string]: any;
}
