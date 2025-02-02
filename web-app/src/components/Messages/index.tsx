import { useRef, useState, useEffect } from "react";
import clsx from 'clsx';


export type Message = {
    id: number;
    text?: string;
    origin?: string;
    sentAt: Date;
    audio?: HTMLAudioElement; // Make audio optional
};

type MessagesProps = {
    messages: Message[];
};

type MessageProps = {
    message: Message;
    handleToggleAudio: (messageId: number, audio: HTMLAudioElement) => void;
    currentlyPlaying: number | null;
};

function Message({ message, handleToggleAudio, currentlyPlaying }: MessageProps) {
    const defaultStyles = "rounded-xl bg-white p-2 ring ring-indigo-50 sm:p-2 lg:p-4 w-fit";
    const isUserMessage = message.origin === "user";
    const [audioDuration, setAudioDuration] = useState<number | null>(null);

    useEffect(() => {
        if (message.audio) {
            const handleLoadedMetadata = () => {
                setAudioDuration(message.audio!.duration);
            };
            message.audio.addEventListener('loadedmetadata', handleLoadedMetadata);

            return () => {
                message.audio?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, [message.audio]);

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    
    return (
        <div
            className={clsx(defaultStyles, !isUserMessage && "bg-indigo-100")}
        >
            <div>
                <div>
                    {message.text && <p>{message.text}</p>}
                    {message.audio && <p className="text-sm text-gray-500">{formatDuration(audioDuration!)}</p>}
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

            <div className={clsx(isUserMessage ? "text-right" : "text-left", "mt-2")}>
                <time dateTime={message.sentAt.toISOString()} className="block text-xs text-gray-500">
                    {message.sentAt.toLocaleString()}
                </time>
            </div>

        </div>
    );
}

function Messages({ messages }: MessagesProps) {
    const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null); // Track which audio is playing
    const audioRef = useRef<HTMLAudioElement | null>(null); // Reference to the audio element

    const toggleAudio = (messageId: number, audio: HTMLAudioElement) => {
        // Pause if the same audio is clicked
        if (currentlyPlaying === messageId) {
            audioRef.current?.pause();
            setCurrentlyPlaying(null);
        } else {
            // Play the new audio
            if (audioRef.current) {
                audioRef.current.pause(); // Pause any existing audio
            }
            audioRef.current = audio;
            audio.play().catch((err) => console.error("Error playing audio:", err));
            setCurrentlyPlaying(messageId);

            // Clear state when the audio ends
            audio.onended = () => setCurrentlyPlaying(null);
        }
    };

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
