import CollectionEntity from "../../components/ContentEntity/CollectionEntity";
import AnswerEntity from "../../components/ContentEntity/AnswerEntity";
import BusinessEntity from "../ContentEntity/BusinessEntity";
import FactEntity from "../ContentEntity/FactEntity";

export function getContentEntityByType(contentEntity: any) {
    switch (contentEntity.type) {
        case 'collection':
            return <CollectionEntity data={contentEntity} />
        case 'answer':
            return <AnswerEntity data={contentEntity} />
        case 'shop':
            return <BusinessEntity data={contentEntity} />
        case 'restaurant':
            return <BusinessEntity data={contentEntity} />
        case 'fact':
            return <FactEntity data={contentEntity} />
        default:
            return null
    }
}

function ContentEntityList({ entities, isLoading }: any) {
    if (isLoading) {
        return (
            <div className="bg-gray-100 px-4 py-3 text-gray-700 rounded-lg shadow-md w-1/4 mx-auto">
                <p className="text-center text-sm font-medium animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <ul>{entities.map((contentEntity: any) => {
            return (
                <li key={contentEntity.id} className="mb-10">
                    {getContentEntityByType(contentEntity)}
                </li>
            )
        })}</ul>
    )
}

export default ContentEntityList