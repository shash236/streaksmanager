import { useState, useEffect, useRef } from 'react';
import { streakService } from '../services/api';
import type { StreakResponse, CreateStreakRequest } from '../types/streak';
import StreakCard from '../components/StreakCard';
import CreateStreakForm from '../components/CreateStreakForm';
import NewStreakCard from '../components/NewStreakCard';
import { toEpoch } from '../utils/dateUtils';


function Dashboard() {
    const [streaks, setStreaks] = useState<StreakResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editingStreak, setEditingStreak] = useState<StreakResponse | null>(null);

    const [columns, setColumns] = useState(1);
    const gridRef = useRef<HTMLDivElement>(null);

    const fetchStreaks = async () => {
        try {
            const data = await streakService.getAll();
            // Sort by createdAt ascending (Oldest first)
            setStreaks(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch streaks:', err);
            setError('Failed to load streaks. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStreaks();
    }, []);

    useEffect(() => {
        const updateColumns = () => {
            if (gridRef.current) {
                const gridStyle = window.getComputedStyle(gridRef.current);
                const gridTemplate = gridStyle.getPropertyValue('grid-template-columns');
                // gridTemplate returns values like "300px 300px 300px"
                // We count the number of elements in that string
                const colCount = gridTemplate.trim().split(/\s+/).length;
                setColumns(colCount > 0 ? colCount : 1);
            }
        };

        // Initial check and subsequent resize listener
        updateColumns();
        window.addEventListener('resize', updateColumns);

        return () => {
            window.removeEventListener('resize', updateColumns);
            // Cleanup timeouts on unmount
            Object.values(recalculationTimeouts.current).forEach(clearTimeout);
        };
    }, [streaks, loading]); // Update when streaks change as grid content/layout might stabilize

    const handleCreateStreak = async (data: CreateStreakRequest) => {
        try {
            await streakService.create(data);
            await fetchStreaks();
            setShowCreateForm(false);
        } catch (err) {
            console.error('Failed to create streak:', err);
            // Could show a toast here
        }
    };

    const handleUpdateStreak = async (data: CreateStreakRequest) => {
        if (!editingStreak) return;
        try {
            await streakService.update(editingStreak.id, data);
            await fetchStreaks();
            setEditingStreak(null);
        } catch (err) {
            console.error('Failed to update streak:', err);
        }
    };

    const handleArchive = async (id: number) => {
        if (!window.confirm('Are you sure you want to archive (delete) this streak? This action cannot be undone.')) return;
        try {
            await streakService.archive(id);
            await fetchStreaks();
        } catch (err) {
            console.error('Failed to archive:', err);
        }
    };

    // Ref to store timeout IDs for debounce: streakId -> Timeout
    const recalculationTimeouts = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

    const scheduleRecalculation = (id: number) => {
        // Clear existing timeout for this streak if any
        if (recalculationTimeouts.current[id]) {
            clearTimeout(recalculationTimeouts.current[id]);
        }

        // Set new timeout for 3 seconds
        recalculationTimeouts.current[id] = setTimeout(async () => {
            try {
                // Call recalculate API
                await streakService.recalculate(id);
                // Then refresh the list to show updated stats
                await fetchStreaks();
                // Clean up
                delete recalculationTimeouts.current[id];
            } catch (err) {
                console.error(`Failed to recalculate stats for streak ${id}:`, err);
            }
        }, 1000); // 1 seconds delay
    };

    const handleCheckIn = async (id: number, date?: string) => {
        try {
            await streakService.checkIn(id, date ? toEpoch(date) : undefined);
            // Optimistic update is handled in StreakCard, but we need to ensure stats eventually update.
            // Schedule delayed recalculation
            scheduleRecalculation(id);
        } catch (err) {
            console.error('Failed to check in:', err);
        }
    };

    const handleUncheck = async (id: number, date?: string) => {
        try {
            await streakService.uncheck(id, date ? toEpoch(date) : undefined);
            // Schedule delayed recalculation
            scheduleRecalculation(id);
        } catch (err) {
            console.error('Failed to uncheck:', err);
        }
    };


    /*
    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            if (currentStatus) {
                await streakService.pause(id);
            } else {
                await streakService.start(id);
            }
            await fetchStreaks();
        } catch (err) {
            console.error('Failed to toggle status:', err);
        }
    };
    */

    // Calculate position for New Streak Card
    // We want it at the end of the first row, or immediately after the last item if fewer than 1 row.
    // Index = min(streaks.length, columns - 1)
    const insertIndex = Math.min(streaks.length, columns - 1);

    const firstBatch = streaks.slice(0, insertIndex);
    const secondBatch = streaks.slice(insertIndex);

    return (
        <div className="container" style={{ paddingBottom: 'var(--spacing-xl)' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--spacing-xl) 0',
                marginBottom: 'var(--spacing-lg)'
            }}>
                {/* Header content removed as sidebar covers title, but maybe keep 'My Streaks' here? */}
                {/* Sidebar has 'Streaks' header. Let's keep a page title here for context. */}
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 'var(--spacing-xs)' }}>My Streaks</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Track your daily progress.</p>
                </div>

                {/* Button moved to card in grid */}
            </header>

            {error && (
                <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--color-danger)',
                    color: 'var(--color-danger)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    {error}
                </div>
            )}

            {showCreateForm && (
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
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', margin: 'var(--spacing-md)' }}>
                        <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: '1.5rem' }}>Start a New Streak</h2>
                        <CreateStreakForm
                            onSubmit={handleCreateStreak}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    </div>
                </div>
            )}

            {editingStreak && (
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
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', margin: 'var(--spacing-md)' }}>
                        <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: '1.5rem' }}>Edit Streak</h2>
                        <CreateStreakForm
                            onSubmit={handleUpdateStreak}
                            onCancel={() => setEditingStreak(null)}
                            initialValues={{ title: editingStreak.title, description: editingStreak.description || '' }}
                            mode="edit"
                        />
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
                    Loading your streaks...
                </div>
            ) : (
                <div
                    ref={gridRef}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 'var(--spacing-lg)'
                    }}
                >
                    {firstBatch.map(streak => (
                        <StreakCard
                            key={streak.id}
                            streak={streak}
                            onCheckIn={handleCheckIn}
                            onUncheck={handleUncheck}
                            onEdit={(s) => setEditingStreak(s)}
                            onArchive={handleArchive}
                        />
                    ))}

                    <NewStreakCard onClick={() => setShowCreateForm(true)} />

                    {secondBatch.map(streak => (
                        <StreakCard
                            key={streak.id}
                            streak={streak}
                            onCheckIn={handleCheckIn}
                            onUncheck={handleUncheck}
                            onEdit={(s) => setEditingStreak(s)}
                            onArchive={handleArchive}
                        />
                    ))}
                </div>
            )}
        </div>
    );

}

export default Dashboard;
