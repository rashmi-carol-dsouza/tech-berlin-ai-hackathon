import { useState } from 'react';
import { useRefContext } from "../../context/Ref";

type PromptBoxProps = {
    onSubmit: (inputValue: string) => void;
    onVoiceInput: () => void;
    isLoading: boolean;
}

function PromptBox({ onSubmit, onVoiceInput, isLoading }: PromptBoxProps) {
    const [inputValue, setInputValue] = useState('');
    const { inputRef } = useRefContext();

    const handleSubmit = (event: any) => {
        event.preventDefault();
        onSubmit(inputValue);
        setInputValue('');
    };

    return (
        <form
            className="flex rounded-md border bg-white shadow-sm w-full items-center"
            onSubmit={handleSubmit}
        >
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-[8] rounded-md border py-2.5 px-4 sm:text-sm"
                placeholder="Type your message..."
            />
            <button
                disabled={isLoading}
                onClick={handleSubmit}
                className="flex-[1] border-e px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            >
                Submit
            </button>
            <button
                className="flex-[1] px-4 py-2 text-gray-700 bg-gray-50 focus:relative"
                title="Speak"
                disabled={true}
                onClick={onVoiceInput}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5 mx-auto"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 1.5a3.75 3.75 0 00-3.75 3.75v6a3.75 3.75 0 007.5 0v-6A3.75 3.75 0 0012 1.5zm-6 9a.75.75 0 00-1.5 0v1.5a7.5 7.5 0 0015 0V10.5a.75.75 0 00-1.5 0v1.5a6 6 0 01-12 0V10.5zM12 15a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3A.75.75 0 0012 15z"
                    />
                </svg>
            </button>
        </form>
    );
}

export default PromptBox;