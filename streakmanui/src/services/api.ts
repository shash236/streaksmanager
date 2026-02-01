import type { CreateStreakRequest, StreakResponse, StreakMetricsResponse, StreakEntryResponse } from '../types/streak';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_BASE_URL = `${API_URL}/api/v1/streaks`;


function getHeaders() {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401 || response.status === 403) {
        // Optional: Redirect to login or clear token if 401
    }
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export const streakService = {
    getAll: async (): Promise<StreakResponse[]> => {
        const response = await fetch(`${API_BASE_URL}`, {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    get: async (id: number): Promise<StreakResponse> => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    create: async (data: CreateStreakRequest): Promise<StreakResponse> => {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    update: async (id: number, data: Partial<CreateStreakRequest>): Promise<StreakResponse> => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    checkIn: async (id: number, date?: string): Promise<StreakResponse> => {
        // Fix URL construction to use the API_BASE_URL properly if it's absolute
        const fetchUrl = new URL(`${API_BASE_URL}/${id}/checkin`);
        if (date) {
            fetchUrl.searchParams.append('date', date);
        }
        const response = await fetch(fetchUrl.toString(), {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    uncheck: async (id: number, date?: string): Promise<StreakResponse> => {
        const fetchUrl = new URL(`${API_BASE_URL}/${id}/uncheck`);
        if (date) {
            fetchUrl.searchParams.append('date', date);
        }
        const response = await fetch(fetchUrl.toString(), {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    pause: async (id: number): Promise<StreakResponse> => {
        const response = await fetch(`${API_BASE_URL}/${id}/pause`, {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    start: async (id: number): Promise<StreakResponse> => {
        const response = await fetch(`${API_BASE_URL}/${id}/start`, {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    archive: async (id: number): Promise<StreakResponse> => {
        const response = await fetch(`${API_BASE_URL}/${id}/archive`, {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    getMetrics: async (id: number): Promise<StreakMetricsResponse> => {
        const response = await fetch(`${API_BASE_URL}/${id}/metrics`, {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    getHistory: async (id: number, range?: string, startDate?: string, endDate?: string): Promise<StreakEntryResponse[]> => {
        const url = new URL(`${API_BASE_URL}/${id}/history`);
        if (startDate && endDate) {
            url.searchParams.append('startDate', startDate);
            url.searchParams.append('endDate', endDate);
        } else if (range) {
            url.searchParams.append('range', range);
        }

        const response = await fetch(url.toString(), {
            headers: getHeaders()
        });
        return handleResponse(response);
    }
};
