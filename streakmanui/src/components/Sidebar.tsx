import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && window.innerWidth <= 768 && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1150,
                        backdropFilter: 'blur(2px)'
                    }}
                />
            )}

            <aside style={{
                width: '240px',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRight: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                padding: 'var(--spacing-lg)',
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                boxSizing: 'border-box',
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease-in-out',
                zIndex: 1200,
                boxShadow: isOpen ? '4px 0 15px rgba(0,0,0,0.3)' : 'none'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="text-gradient" style={{
                        fontSize: '1.8rem',
                        marginBottom: 'var(--spacing-xl)',
                        marginTop: 'var(--spacing-xs)',
                        fontFamily: 'var(--font-heading)'
                    }}>
                        Streaks
                    </h2>
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-secondary)',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        marginBottom: 'var(--spacing-xl)'
                    }}>
                        &times;
                    </button>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    <NavLink
                        to="/"
                        onClick={() => window.innerWidth <= 768 && onClose()}
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            color: isActive ? 'white' : 'var(--color-text-secondary)',
                            backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                            fontWeight: isActive ? 600 : 500,
                            transition: 'all 0.2s ease'
                        })}
                    >
                        <span>🔥</span>
                        <span>My Streaks</span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        onClick={() => window.innerWidth <= 768 && onClose()}
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            color: isActive ? 'white' : 'var(--color-text-secondary)',
                            backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                            fontWeight: isActive ? 600 : 500,
                            transition: 'all 0.2s ease'
                        })}
                    >
                        <span>⚙️</span>
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to logout?")) {
                                logout();
                            }
                        }}
                        className="nav-link"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            color: 'var(--color-danger)',
                            backgroundColor: 'transparent',
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                            width: '100%',
                            textAlign: 'left'
                        }}
                    >
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
