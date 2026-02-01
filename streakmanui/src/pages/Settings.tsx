import React from 'react';

const Settings: React.FC = () => {
    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Settings</h1>

            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Account</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>Login functionality coming soon.</p>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Appearance</h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                    <span>Theme</span>
                    <select style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--color-bg-primary)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)'
                    }} disabled>
                        <option>Dark Mode</option>
                        <option>Light Mode</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Settings;
