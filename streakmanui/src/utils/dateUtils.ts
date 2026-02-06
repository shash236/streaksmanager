export const toEpoch = (dateStr: string): number => {
    // dateStr is YYYY-MM-DD
    const [y, m, d] = dateStr.split('-').map(Number);
    // Return UTC Midnight timestamp
    return Date.UTC(y, m - 1, d);
};

export const fromEpoch = (epoch: number): string => {
    // Return YYYY-MM-DD from UTC timestamp
    // We use toISOString() which is always UTC
    return new Date(epoch).toISOString().split('T')[0];
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

export const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;
