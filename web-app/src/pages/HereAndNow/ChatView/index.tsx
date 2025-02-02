import { useState } from "react";
import Messages, { Message } from "../../../components/Messages";
import PromptBox from "../../../components/PromptBox";

function ChatView() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [queryInput, setQueryInput] = useState<string | undefined>(undefined);

    const handleQueryInput = (input: string) => {
        console.log(input);
        setQueryInput(input);
        setMessages((prevMessages) => [...prevMessages, { id: prevMessages.length, text: input, origin: 'user' }]);
    }
    return (
        <>
            <Messages
                messages={messages}
                isLoading={false}
                isError={false}
                error={null}
                queryInput={queryInput}
            />
            <PromptBox
                onSubmit={(inputValue: string) => handleQueryInput(inputValue)}
                onVoiceInput={() => console.log('Voice input not implemented')}
                isLoading={false}
            />
        </>
    );
}

export default ChatView;