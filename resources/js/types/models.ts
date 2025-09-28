export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profile_photo_url: string;
    full_name: string;
    email_verified: boolean;
    created_at?: string;
    adminProfile?: AdminProfile;
    judgeProfile?: JudgeProfile;
}

export interface Participant {
    user_id: number;
    encryption_code: string;
    nik?: string | null;
    category: string;
    phone_number: string;
    job_or_institution?: string | null;
    date_of_birth: string;
    domicile: string;
    created_at: string;
    updated_at: string;
    user?: User;
    eventRegistration?: EventRegistration;
}

export interface Event {
    id: number;
    event_code: string;
    event_name: string;
    description: string;
    registration_open_date: string;
    registration_close_date: string;
    start_date: string;
    end_date: string;
    location: string;
    is_paid_event: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    status:
        | "upcoming"
        | "registration_open"
        | "registration_closed"
        | "ongoing"
        | "completed";
}

export interface JudgeProfile {
    user_id: number;
    full_name: string;
    created_at: string;
    updated_at: string;
}

export interface AdminProfile {
    user_id: number;
    admin_level: 'super_admin' | 'moderator';
    created_at: string;
    updated_at: string;
}

export interface Team {
    id: number;
    team_name: string;
    team_code: string;
    leader_id: number;
    created_at: string;
    updated_at: string;
    leader?: User;
    members?: User[];
}

export interface SubEvent {
    id: number;
    event_id: number;
    sub_event_code: string;
    sub_event_name: string;
    description: string;
    start_time: string;
    end_time: string;
    location: string;
    max_participants: number | null;
    is_active: boolean;
    additional_info: any;
    created_at: string;
    updated_at: string;
    event?: Event;
    current_registration_count?: number;
    available_slots?: number;
    status: "upcoming" | "ongoing" | "completed" | "full" | "inactive";
}

export interface EventRegistration {
    id: number;
    user_id: number;
    event_id: number;
    sub_event_id?: number | null;
    registration_date: string;
    registration_status: "pending" | "registered" | "cancelled";
    payment_status:
        | "pending"
        | "paid"
        | "failed"
        | "verified"
        | "rejected"
        | null;
    payment_amount: number | null;
    payment_date: string | null;
    invoice_id: string | null;
    twibbon_link: string | null;
    created_at: string;
    updated_at: string;
    event?: Event;
    sub_event?: SubEvent;
    participant?: Participant;
}

/**
 * Activity model for events such as Hacksphere
 */
export interface Activity {
    id: number;
    name: string;
    event_id: number;
    description: string;
    activity_code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    event?: Event;
}

/**
 * TeamActivityVerification model for QR code verifications
 */
export interface TeamActivityVerification {
    id: number;
    team_id: number;
    activity_id: number;
    verification_token: string;
    status: "active" | "used" | "expired";
    verified_at: string | null;
    verified_by: number | null;
    created_at: string;
    updated_at: string;
    team?: Team;
    activity?: Activity;
    verifier?: User;
}

export interface Partner {
    id: string | number;
    name?: string;
    logo?: string;
    url?: string;
}

export interface Sponsor {
    id: string | number;
    name? : string;
    logo? : string;
    url? : string;
}

export interface UserManagementStats {
    total_admins: number;
    super_admins: number;
    moderators: number;
    judges: number;
}

export interface CreateModeratorForm {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    send_credentials: boolean;
    [key: string]: any;
}

export interface CreateJudgeForm {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    full_name: string;
    send_credentials: boolean;
    [key: string]: any;
}