import { useState } from "react";
import Messages, { Message } from "../../../components/Messages";
import PromptBox from "../../../components/PromptBox";
import { sendChatMessage } from "../../../api/chat";
import { useMutation } from "@tanstack/react-query";

type StatusIndicatorProps = {
    messages: Message[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    queryInput?: string;
}

const StatusIndicator = ({isLoading, isError, error, queryInput }: StatusIndicatorProps) => {
    let message;
    if (isLoading) {
        message = <p className="text-gray-500 italic">Loading...</p>;
    }

    if (isError) {
        message = <p className="text-red-500">Error: {error!.message}</p>;
    }

    if (!queryInput) {
        message= <p className="text-gray-400">Type something and press enter to start your search.</p>;
    }

    return (
        <div className="flex justify-center">
            {message}
        </div>
    )
};

function ChatView() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [queryInput, setQueryInput] = useState<string | undefined>(undefined);

    const mutation = useMutation({
        mutationFn: sendChatMessage,
        onSuccess: (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        },
        onError: (error) => {
            console.error("Error sending message:", error);
        }
    });

    const handleQueryInput = (input: string) => {
        setQueryInput(input);
        setMessages((prevMessages => [...prevMessages, { id: Math.random(), origin: "user", text: input, sentAt: new Date() }]));
        mutation.mutate(input);
    };

    return (
        <>
            <Messages
                messages={messages}
            />
            <StatusIndicator 
                isLoading={mutation.isPending}
                isError={mutation.isError}
                error={mutation.error}
                queryInput={queryInput}
                messages={messages}
            />
            <PromptBox
                onSubmit={(inputValue: string) => handleQueryInput(inputValue)}
                onVoiceInput={() => console.log('Voice input not implemented')}
                isLoading={mutation.isPending}
            />
        </>
    );
}

export default ChatView;