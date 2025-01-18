import { useState } from 'react';

type PromptBoxProps = {
    onSubmit: (inputValue: string) => void;
    isLoading: boolean;
}

function PromptBox({ onSubmit, isLoading }: PromptBoxProps) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        onSubmit(inputValue);
        setInputValue('');
    };

    return (
        <div>
            <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="rounded-md border-gray-800 py-2.5 pe-10 shadow-sm sm:text-sm"
            />
            <button
                disabled={isLoading}
                onClick={handleSubmit}
            >
                {isLoading ? "Loading..." : "Submit" }
            </button>
        </div>
    );
}

export default PromptBox;