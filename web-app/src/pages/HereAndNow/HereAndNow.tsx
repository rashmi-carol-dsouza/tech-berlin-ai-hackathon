import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRelevantContentEntities } from "../../api/relevantContentEntities";
import PromptBox from "../../components/PromptBox";
import Messages, { Message } from "../../components/Messages";
import { useLocation } from "../../context/Location";
import LocationView from "./LocationView";

function HereAndNow() {
    const { coordinates } = useLocation();
    const [queryInput, setQueryInput] = useState<string | undefined>(undefined);
    const [messages, setMessages] = useState<Message[]>([]);

    const { data, isError, isLoading, error } = useQuery({
        queryKey: ['contentEntities', queryInput],
        queryFn: () => getRelevantContentEntities(coordinates.lat, coordinates.long, queryInput),
        enabled: queryInput !== null,
    });

    useEffect(() => {
        if (data?.messages) {
            const newMessages = data.messages.map((message: any, index: number) => ({
                id: message.id || index,
                text: message.text,
                audio: data.audio && data.audio[index], // Associate audio if available
            }));
            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        }
    }, [data]);

    return (
        <div>
            <LocationView coordinates={coordinates} />
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
        </div>
    );
}

export default HereAndNow;
