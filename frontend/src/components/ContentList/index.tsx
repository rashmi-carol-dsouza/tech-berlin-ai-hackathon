import CollectionEntity from "../../components/ContentEntity/CollectionEntity";
import AnswerEntity from "../../components/ContentEntity/AnswerEntity";
import ShopEntity from "../../components/ContentEntity/ShopEntity";
import RestaurantEntity from "../../components/ContentEntity/RestaurantEntity";

function getContentEntityByType(contentEntity: any) {
    switch (contentEntity.type) {
        case 'collection':
            return <CollectionEntity data={contentEntity} />
        case 'answer':
            return <AnswerEntity data={contentEntity} />
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

export default ContentEntityList