import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRelevantContentEntities } from "../../api/relevantContentEntities";
import PromptBox from "../../components/PromptBox";
import Messages from "../../components/Messages";
import { useLocation } from "../../context/Location";
import LocationView from "./LocationView";

function HereAndNow() {
    const { coordinates } = useLocation();
    const [queryInput, setQueryInput] = useState<string | undefined>(undefined);
    const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);

    const { data, isError, isLoading, error } = useQuery({
        queryKey: ['contentEntities', queryInput],
        queryFn: () => getRelevantContentEntities(coordinates.lat, coordinates.long, queryInput),
        enabled: queryInput !== null,
    });

    useEffect(() => {
        if (data?.messages) {
            setMessages((prevMessages) => [...prevMessages, ...data.messages]);
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
