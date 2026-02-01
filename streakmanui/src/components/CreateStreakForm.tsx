import React, { useState } from 'react';
import type { CreateStreakRequest } from '../types/streak';

interface CreateStreakFormProps {
    onSubmit: (data: CreateStreakRequest) => Promise<void>;
    onCancel: () => void;
    initialValues?: { title: string; description: string };
    mode?: 'create' | 'edit';
}

const CreateStreakForm: React.FC<CreateStreakFormProps> = ({ onSubmit, onCancel, initialValues, mode = 'create' }) => {
    const [title, setTitle] = useState(initialValues?.title || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            await onSubmit({
                title,
                description,
                active: true
            });
            if (mode === 'create') {
                setTitle('');
                setDescription('');
            }
        } catch (error) {
            console.error('Failed to save streak:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div>
                <label htmlFor="title" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.875rem', fontWeight: 500 }}>
                    Streak Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Read 30 minutes"
                    required
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-sm)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        fontSize: '1rem',
                    }}
                />
            </div>

            <div>
                <label htmlFor="description" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.875rem', fontWeight: 500 }}>
                    Description (Optional)
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's your goal?"
                    rows={3}
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-sm)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        fontSize: '1rem',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : (mode === 'create' ? 'Create Streak' : 'Save Changes')}
                </button>
            </div>
        </form>
    );
};

export default CreateStreakForm;
