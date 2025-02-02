import { useQuery } from "@tanstack/react-query";
import { getRelevantContentEntities } from "../../api/relevantContentEntities";
import { useLocation } from "../../context/Location";
import { useViewContext } from "../../context/View";
import ContentEntityList from "../../components/ContentList";
import ChatView from "./ChatView";
import HeroBanner from "./HeroBanner";

function HereAndNow() {
    const { coordinates } = useLocation();
    const { viewState } = useViewContext();

    const { data, isLoading } = useQuery({
        queryKey: [],
        queryFn: () => getRelevantContentEntities(coordinates.lat, coordinates.long),
        enabled: coordinates.lat !== null && coordinates.long !== null,
    });

    return (
        <div>
            {isLoading && <HeroBanner coordinates={coordinates} />}
            {viewState === 'findNearby' && <ContentEntityList entities={data?.entities} isLoading={isLoading} />}
            {viewState === 'askQuestion' && <ChatView />}
        </div>
    );
}

export default HereAndNow;
