import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [method, setMethod] = useState<'email' | 'phone'>('email');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'request' | 'verify'>('request');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIdentifier(e.target.value);
        setError('');
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/auth/otp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(method === 'email' ? { email: identifier } : { phone: identifier }),
            });

            if (response.ok) {
                setStep('verify');
            } else {
                setError('Failed to send OTP. Please try again.');
                // For MVP, we might fail if identifier is empty etc.
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Is the server running?');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/auth/otp/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    [method]: identifier,
                    otp
                }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token, data.user);
                navigate('/');
            } else {
                setError('Invalid OTP.');
            }
        } catch (err) {
            console.error(err);
            setError('Verification failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100%',
            padding: '1rem'
        }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>
                    Welcome Back
                </h1>

                {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                {step === 'request' ? (
                    <>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                            <button
                                className={`tab-btn ${method === 'email' ? 'active' : ''}`}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    background: 'none',
                                    borderBottom: method === 'email' ? '2px solid var(--color-accent)' : '2px solid transparent',
                                    color: method === 'email' ? 'var(--color-text-primary)' : 'var(--color-text-muted)'
                                }}
                                onClick={() => { setMethod('email'); setIdentifier(''); setError(''); }}
                            >
                                Email
                            </button>
                            <button
                                className={`tab-btn ${method === 'phone' ? 'active' : ''}`}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    background: 'none',
                                    borderBottom: method === 'phone' ? '2px solid var(--color-accent)' : '2px solid transparent',
                                    color: method === 'phone' ? 'var(--color-text-primary)' : 'var(--color-text-muted)'
                                }}
                                onClick={() => { setMethod('phone'); setIdentifier(''); setError(''); }}
                            >
                                Phone
                            </button>
                        </div>

                        <form onSubmit={handleSendOtp}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                    {method === 'email' ? 'Email Address' : 'Phone Number'}
                                </label>
                                <input
                                    type={method === 'email' ? "email" : "tel"}
                                    value={identifier}
                                    onChange={handleIdentifierChange}
                                    placeholder={method === 'email' ? "you@example.com" : "+1 234 567 8900"}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg-secondary)',
                                        color: 'var(--color-text-primary)',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send Login Code'}
                            </button>
                        </form>
                    </>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                Enter Code sent to {identifier}
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                required
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg-secondary)',
                                    color: 'var(--color-text-primary)',
                                    textAlign: 'center',
                                    fontSize: '1.25rem',
                                    letterSpacing: '0.5rem'
                                }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('request')}
                            style={{
                                background: 'none',
                                color: 'var(--color-text-muted)',
                                marginTop: '1rem',
                                fontSize: '0.875rem',
                                display: 'block',
                                width: '100%',
                                textAlign: 'center'
                            }}
                        >
                            Use a different {method}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
