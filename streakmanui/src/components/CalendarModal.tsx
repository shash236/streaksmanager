import React, { useState, useEffect } from 'react';
import { streakService } from '../services/api';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    streakId: number;
    streakTitle: string;
    currentStreak: number;
    longestStreak: number;
    onUpdate: () => void; // To refresh parent data if needed
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, streakId, streakTitle, currentStreak, longestStreak, onUpdate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [history, setHistory] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen, currentDate, streakId]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            // Calculate start and end of month for API
            // Using generic logic: get full month history
            // We can pass YYYY-MM-DD strings
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);

            // Format as YYYY-MM-DD
            // Important: Use local time values to construct string
            const formatDate = (d: Date) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
            };

            const entries = await streakService.getHistory(
                streakId,
                undefined,
                formatDate(firstDay),
                formatDate(lastDay)
            );

            const historySet = new Set(entries.map(e => e.checkInDate));
            setHistory(historySet);
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckToggle = async (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexed
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // Prevent future checkins?
        const checkDate = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkDate > today) return; // Future dates disabled

        const isChecked = history.has(dateStr);

        try {
            // Optimistic update
            const newHistory = new Set(history);
            if (isChecked) {
                newHistory.delete(dateStr);
                await streakService.uncheck(streakId, dateStr);
            } else {
                newHistory.add(dateStr);
                await streakService.checkIn(streakId, dateStr);
            }
            setHistory(newHistory);
            onUpdate(); // Refresh parent stats
        } catch (error) {
            console.error('Failed to toggle checkin', error);
            // Revert on failure (could be improved)
            fetchHistory();
        }
    };

    if (!isOpen) return null;

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    // adjust for Monday start: Sunday is 0, make it 7. Mon(1)->0, ... Sun(0)->6
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Check if day is today to highlight? optional
    const isToday = (day: number) => {
        const today = new Date();
        return Utils.isSameDay(today, new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: 'var(--spacing-lg)',
                    margin: 'var(--spacing-md)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '4px' }}>{streakTitle}</h2>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent)' }}>{currentStreak} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>days</span></span>
                            </div>
                            <div style={{ width: '1px', backgroundColor: 'var(--color-border)', height: 'auto' }}></div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Best</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{longestStreak} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>days</span></span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', color: 'var(--color-text-secondary)', fontSize: '1.5rem', padding: '0', lineHeight: 1 }}>&times;</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: '1.1rem', fontWeight: 600 }}>
                        <span>📅</span>
                        <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                        {loading && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>(Syncing...)</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                        <button onClick={prevMonth} className="btn-secondary" style={{ padding: '4px 8px' }}>&lt;</button>
                        <button onClick={nextMonth} className="btn-secondary" style={{ padding: '4px 8px' }}>&gt;</button>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '8px',
                    textAlign: 'center',
                    marginBottom: 'var(--spacing-sm)'
                }}>
                    {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(day => (
                        <div key={day} style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: 'var(--color-text-secondary)'
                        }}>{day}</div>
                    ))}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '8px',
                    textAlign: 'center'
                }}>
                    {Array.from({ length: startOffset }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isChecked = history.has(dateStr);
                        const isFuture = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) > new Date((new Date()).setHours(0, 0, 0, 0));
                        const isCurrentDay = isToday(day);

                        return (
                            <button
                                key={day}
                                onClick={() => handleCheckToggle(day)}
                                disabled={isFuture}
                                style={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    borderRadius: '50%',
                                    border: isCurrentDay ? '1px solid var(--color-accent)' : 'none',
                                    backgroundColor: isChecked
                                        ? '#10B981' // Green for checked
                                        : 'rgba(255, 255, 255, 0.05)',
                                    color: isChecked ? 'white' : 'var(--color-text-primary)',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    opacity: isFuture ? 0.3 : 1,
                                    cursor: isFuture ? 'default' : 'pointer'
                                }}
                            >
                                {day}
                                {isChecked && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '2px',
                                        right: '50%',
                                        transform: 'translateX(50%)',
                                        fontSize: '8px'
                                    }}>×</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Utils helper to avoid creating a new file for one function if not exists
const Utils = {
    isSameDay: (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }
};

export default CalendarModal;
