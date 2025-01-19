import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRelevantContentEntities } from "../../api/relevantContentEntities";
import { useLocation } from "../../context/Location";
import LocationView from "./LocationView";
import { useViewContext } from "../../context/View";
import ContentEntityList from "../../components/ContentList";
import ChatView from "./ChatView";
import { Message } from "../../components/Messages";

function HereAndNow() {
    const { coordinates } = useLocation();
    const { viewState } = useViewContext();
    const [queryInput, setQueryInput] = useState<string | undefined>(undefined);
    const [messages, setMessages] = useState<Message[]>([]);

    const handleQueryInput = (input: string) => {
        setQueryInput(input);
        setMessages((prevMessages) => [...prevMessages, { id: prevMessages.length, text: input, origin: 'user' }]);
    }

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
                type: 'bot',
                audio: data.audio && data.audio[index], // Associate audio if available
            }));
            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        }
    }, [data]);

    return (
        <div>
            <LocationView coordinates={coordinates} />
            {viewState === 'findNearby' && <ContentEntityList entities={data?.entities} isLoading={isLoading} />}
            {viewState === 'askQuestion' && <ChatView messages={messages} isLoading={false} isError={isError} error={error} queryInput={queryInput} setQueryInput={handleQueryInput} />}
        </div>
    );
}

export default HereAndNow;
