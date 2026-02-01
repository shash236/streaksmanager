export interface Streak {
    id: number;
    title: string;
    description?: string;
    currentStreak: number;
    longestStreak: number;
    active: boolean;
    lastCheckIn?: string;
    createdAt: string;
    updatedAt: string;
    pastWeekHistory?: string[];
}

export interface CreateStreakRequest {
    title: string;
    description?: string;
    active: boolean;
}

export interface StreakResponse {
    id: number;
    title: string;
    description?: string;
    currentStreak: number;
    longestStreak: number;
    active: boolean;
    lastCheckIn?: string;
    createdAt: string;
    updatedAt: string;
    pastWeekHistory?: string[]; // Added this as backend returns it in mapToResponse
}

export interface StreakMetricsResponse {
    currentStreak: number;
    longestStreak: number;
    totalCheckins: number;
    lastCheckIn: string;
}

export interface StreakEntryResponse {
    id: number;
    streakId: number;
    checkInDate: string;
    createdAt: string;
}
