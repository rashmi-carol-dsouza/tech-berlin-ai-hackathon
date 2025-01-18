function FactEntity({ data }: any) {
    return (
        <article className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 sm:items-center" >
            <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        {data.title}
                    </h2>

                    <p className="hidden text-gray-500 md:mt-4 md:block">
                        {data.description}
                    </p>
                </div>
            </div>

            <img
                alt={data.altText}
                src={data.image}
                className="h-full w-full object-cover sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%_-_4rem)] md:rounded-ss-[60px]"
            />
        </article>
    )
}

export default FactEntity;