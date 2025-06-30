export interface User {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    role: 'participant' | 'admin' | 'judge';
    email_verified: boolean;
}

export interface ParticipantDetail {
    id: number;
    user_id: number;
    institution: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
}

export interface JudgeProfile {
    id: number;
    user_id: number;
    institution: string;
    expertise: string;
    created_at: string;
    updated_at: string;
}

export interface AdminProfile {
    id: number;
    user_id: number;
    department: string;
    created_at: string;
    updated_at: string;
}

export interface Team {
    id: number;
    name: string;
    leader_id: number;
    created_at: string;
    updated_at: string;
    leader?: ParticipantDetail;
    members?: ParticipantDetail[];
}
