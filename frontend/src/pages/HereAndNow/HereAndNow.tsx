import { useQuery } from "@tanstack/react-query";
import { getRelevantContentEntities } from "../../api/relevantContentEntities";

type HereAndNowProps = {
    lat: number;
    long: number;
}

function getContentEntityByType(contentEntity: any) {
    switch (contentEntity.type) {
        case 'collection':
            return <CollectionEntity data={contentEntity} />
        case 'fun_fact':
            return <FunFactEntity data={contentEntity} />
        case 'shop':
            return <ShopEntity data={contentEntity} />
        case 'restaurant':
            return <RestaurantEntity data={contentEntity} />
        default:
            return null
    }
}

function ContentEntityList({ entities }: any) {
    return (
        <ul>{entities.map((contentEntity: any) => {
            return (
                <li key={contentEntity.id}>
                    {getContentEntityByType(contentEntity)}
                </li>
            )
        })}</ul>
    )
}

function HereAndNow({ lat, long }: HereAndNowProps) {
    const { isPending, isError, data, error } = useQuery({ queryKey: ['contentEntities'], queryFn: () => getRelevantContentEntities(lat, long) });
    if (isPending) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <div>
            <ContentEntityList entities={data.entities} />
        </div>
    )
}

export default HereAndNow;