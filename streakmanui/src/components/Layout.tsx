import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(window.innerWidth > 768);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)', position: 'relative' }}>
            {!isSidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        zIndex: 1100,
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--color-text-primary)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                >
                    ☰
                </button>
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main style={{
                flex: 1,
                overflowY: 'auto',
                marginLeft: isSidebarOpen && window.innerWidth > 768 ? '240px' : '0',
                transition: 'margin-left 0.3s ease-in-out',
                paddingTop: '60px' // Space for the button
            }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
