'use client';

interface EditorButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    active?: boolean;
}

const EditorButton = ({ icon, onClick, active = false }: EditorButtonProps) => (
    <button
        type="button"
        className={`p-1 rounded hover:bg-gray-700 text-gray-200 transition-colors ${
            active ? 'bg-gray-700 text-white' : ''
        }`}
        onClick={onClick}
    >
        {icon}
    </button>
);

export default EditorButton;