export interface Streak {
    id: number;
    title: string;
    description?: string;
    currentStreak: number;
    longestStreak: number;
    active: boolean;
    lastCheckIn?: number;
    createdAt: number;
    updatedAt: number;
    pastWeekHistory?: number[];
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
    lastCheckIn?: number;
    createdAt: number;
    updatedAt: number;
    pastWeekHistory?: number[]; // Added this as backend returns it in mapToResponse
}

export interface StreakMetricsResponse {
    currentStreak: number;
    longestStreak: number;
    totalCheckins: number;
    lastCheckIn: number;
}

export interface StreakEntryResponse {
    id: number;
    streakId: number;
    checkInDate: number;
    createdAt: number;
}
