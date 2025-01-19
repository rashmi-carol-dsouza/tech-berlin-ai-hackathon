import { useRef, useState } from "react";
import clsx from 'clsx';
import Logo from "../Base/Logo";

export type Message = {
    id: number;
    text: string;
    origin?: string;
    audio?: string; // Make audio optional
};

type MessagesProps = {
    messages: Message[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    queryInput?: string;
};

type MessageProps = {
    message: Message;
    handleToggleAudio: (messageId: number, audioUrl: string) => void;
    currentlyPlaying: number | null;
};

function Message({ message, handleToggleAudio, currentlyPlaying }: MessageProps) {
    const defaultStyles = "rounded-xl bg-white p-2 ring ring-indigo-50 sm:p-4 lg:p-6 w-fit";
    const isUserMessage = message.origin === "user";
    return (
        <div
            className={clsx(defaultStyles, isUserMessage && "bg-indigo-50")}
        >
            <div className="flex items-center gap-4">
                {!isUserMessage && (<Logo />)}
                <div>
                    <p>{message.text}</p>
                    {message.audio && (
                        <button
                            onClick={() => handleToggleAudio(message.id, message.audio!)}
                            className={`mt-2 px-2 py-1 rounded shadow text-white focus:outline-none focus:ring-2 ${currentlyPlaying === message.id
                                ? "bg-red-500 hover:bg-red-600 focus:ring-red-400"
                                : "bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-400"
                                }`}
                        >
                            {currentlyPlaying === message.id ? "Pause" : "Play"}
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}

function Messages({ messages, isLoading, isError, error, queryInput }: MessagesProps) {
    const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null); // Track which audio is playing
    const audioRef = useRef<HTMLAudioElement | null>(null); // Reference to the audio element

    const toggleAudio = (messageId: number, audioUrl: string) => {
        // Pause if the same audio is clicked
        if (currentlyPlaying === messageId) {
            audioRef.current?.pause();
            setCurrentlyPlaying(null);
        } else {
            // Play the new audio
            if (audioRef.current) {
                audioRef.current.pause(); // Pause any existing audio
            }
            const newAudio = new Audio(audioUrl);
            audioRef.current = newAudio;
            newAudio.play().catch((err) => console.error("Error playing audio:", err));
            setCurrentlyPlaying(messageId);

            // Clear state when the audio ends
            newAudio.onended = () => setCurrentlyPlaying(null);
        }
    };

    if (isLoading) {
        return <p className="text-gray-500 italic">Loading messages...</p>;
    }

    if (isError) {
        return <p className="text-red-500">Error: {error!.message}</p>;
    }

    if (!queryInput) {
        return <p className="text-gray-400">Type something and press enter to start your search.</p>;
    }

    if (messages.length === 0) {
        return <p className="text-gray-500 italic">No results found for your query.</p>;
    }

    return (
        <ul className="flex flex-col">
            {messages.map((message) => {
                const isUserMessage = message.origin === "user";
                return (
                    <li
                        key={message.id}
                        className={clsx("mb-4", isUserMessage && "self-end")}
                    >
                        <Message
                            message={message}
                            handleToggleAudio={toggleAudio}
                            currentlyPlaying={currentlyPlaying}
                        />
                    </li>
                )
            })}
        </ul>
    );
}

export default Messages;
