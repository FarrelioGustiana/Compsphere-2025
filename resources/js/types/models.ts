export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profile_photo_url: string;
    full_name: string;
    email_verified: boolean;
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
    team_name: string;
    team_code: string;
    leader_id: number;
    created_at: string;
    updated_at: string;
    leader?: User;
    members?: User[];
}

export interface EventRegistration {
    id: number;
    user_id: number;
    event_id: number;
    registration_date: string;
    registration_status: "pending" | "registered" | "cancelled";
    payment_status: "pending" | "paid" | "failed" | null;
    payment_amount: number | null;
    payment_date: string | null;
    invoice_id: string | null;
    created_at: string;
    updated_at: string;
    event?: Event;
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
