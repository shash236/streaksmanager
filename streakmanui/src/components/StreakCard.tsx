import React, { useState } from 'react';
import type { Streak } from '../types/streak';
import CalendarModal from './CalendarModal';
import { fromEpoch } from '../utils/dateUtils';

interface StreakCardProps {
    streak: Streak;
    onCheckIn: (id: number, date?: string) => void;
    onUncheck: (id: number, date?: string) => void;
    onEdit?: (streak: Streak) => void;
    onArchive?: (id: number) => void;
}

const StreakCard: React.FC<StreakCardProps> = ({ streak, onCheckIn, onUncheck, onEdit, onArchive }) => {

    const [historySet, setHistorySet] = useState<Set<string>>(new Set());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleDayClick = (e: React.MouseEvent, dateStr: string) => {
        e.stopPropagation();
        const isChecked = historySet.has(dateStr);
        if (isChecked) {
            onUncheck(streak.id, dateStr);
            // Optimistic update
            const newSet = new Set(historySet);
            newSet.delete(dateStr);
            setHistorySet(newSet);
        } else {
            onCheckIn(streak.id, dateStr);
            // Optimistic update
            const newSet = new Set(historySet);
            newSet.add(dateStr);
            setHistorySet(newSet);
        }
    };

    React.useEffect(() => {
        if (streak.pastWeekHistory) {
            setHistorySet(new Set(streak.pastWeekHistory.map(fromEpoch)));
        }
    }, [streak.pastWeekHistory]);




    // Generate last 7 days for the weekly view
    // Actually, design shows S M T W T F S (Static labels) or dynamic? 
    // Usually these apps show "Current Week" or "Last 7 Days". 
    // Given the labels S M ... it implies days of week.
    // Let's render the Current Week (ending today or just static Mon-Sun window).
    // Better: Render the LAST 7 DAYS ending TODAY, but label them by their day name.

    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        // Fix: Use local date string instead of toISOString (which is UTC)
        // This ensures that if it's Monday locally, we generate 'YYYY-MM-DD' for Monday, not Sunday (due to timezone)
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' }); // S, M, T...
        days.push({ dateStr, dayLabel, fullDate: d });
    }

    return (
        <>
            <div
                className="card streak-card"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-md)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onClick={() => setIsCalendarOpen(true)}
            >
                {/* Flame Icon Background/Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '4rem',
                    opacity: streak.currentStreak > 0 ? 0.2 : 0.05,
                    color: streak.currentStreak > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)',
                    pointerEvents: 'none'
                }}>
                    🔥
                </div>

                {/* Header Section: Title & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
                        {streak.title}
                    </h3>

                    <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                        {onEdit && (
                            <button
                                onClick={() => onEdit(streak)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    color: 'var(--color-text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.2s'
                                }}
                                title="Edit Streak"
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </button>
                        )}
                        {onArchive && (
                            <button
                                onClick={() => onArchive(streak.id)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    color: 'var(--color-text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.2s'
                                }}
                                title="Archive Streak"
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>

                </div>

                {/* Streak Status */}
                <div style={{ zIndex: 2 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: streak.active ? 'var(--color-accent)' : 'var(--color-text-muted)', marginBottom: '4px' }}>
                        {streak.currentStreak} day streak
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                        {streak.currentStreak > 0
                            ? "Great job! Keep the flame lit!"
                            : "Do a lesson today to start a new streak!"}
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    padding: 'var(--spacing-md)',
                    marginTop: 'var(--spacing-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-sm)',
                    zIndex: 2
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {days.map((day, index) => {
                            const isChecked = historySet.has(day.dateStr);
                            const isToday = index === 6; // Last one is today

                            return (
                                <div key={day.dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                        color: isToday ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        {day.dayLabel}
                                    </span>
                                    <div
                                        onClick={(e) => handleDayClick(e, day.dateStr)}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: isChecked ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                                            color: isChecked ? 'white' : 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            border: isToday && !isChecked ? '1px solid var(--color-text-muted)' : 'none',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {isChecked ? '✓' : ''}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <CalendarModal
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                streakId={streak.id}
                streakTitle={streak.title}
                currentStreak={streak.currentStreak}
                longestStreak={streak.longestStreak}
                onUpdate={() => { }} // No updates allowed in read-only
                readOnly={true}
            />
        </>
    );
};

export default StreakCard;
