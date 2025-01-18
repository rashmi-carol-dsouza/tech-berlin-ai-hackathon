import { getContentEntityByType } from "../../ContentList";

function CollectionEntity({ data }: any) {
    return (
        <section className="overflow-hidden bg-gray-50">
            <div className="p-6 md:p-4 lg:px-6 lg:py-8">
                <div className="mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        {data.title}
                    </h2>
                    <p className="hidden text-gray-500 md:mt-4 md:block">
                        {data.description}
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
                    {data.entities.slice(0,4).map((entity: any) => getContentEntityByType(entity))}
                </div>
            </div>
        </section>
    )
}

export default CollectionEntity;