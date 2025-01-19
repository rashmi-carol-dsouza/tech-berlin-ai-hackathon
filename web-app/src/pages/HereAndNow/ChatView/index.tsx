import Messages, { Message } from "../../../components/Messages";
import PromptBox from "../../../components/PromptBox";

type ChatViewProps = {
    messages: Message[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    queryInput?: string;
    setQueryInput: (input: string) => void;
};

function ChatView({ messages, isLoading, isError, error, queryInput, setQueryInput }: ChatViewProps) {
    return (
        <>
            <Messages
                messages={messages}
                isLoading={isLoading}
                isError={isError}
                error={error}
                queryInput={queryInput}
            />
            <PromptBox
                onSubmit={(inputValue: string) => setQueryInput(inputValue)}
                onVoiceInput={() => console.log('Voice input not implemented')}
                isLoading={isLoading}
            />
        </>
    );
}

export default ChatView;