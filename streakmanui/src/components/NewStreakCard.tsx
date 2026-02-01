import React from 'react';

interface NewStreakCardProps {
    onClick: () => void;
}

const NewStreakCard: React.FC<NewStreakCardProps> = ({ onClick }) => {
    return (
        <div
            className="card"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-md)',
                cursor: 'pointer',
                minHeight: '260px', // Approximate height to match StreakCard visually
                border: '2px dashed var(--color-border)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                transition: 'all var(--transition-normal)'
            }}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
            }}
        >
            <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px var(--color-accent-glow)',
                marginBottom: 'var(--spacing-sm)'
            }}>
                <span style={{ fontSize: '2rem', color: 'white', lineHeight: 1 }}>+</span>
            </div>

            <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
            }}>
                New Streak
            </h3>

            <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                textAlign: 'center'
            }}>
                Start a new daily habit
            </p>
        </div>
    );
};

export default NewStreakCard;
