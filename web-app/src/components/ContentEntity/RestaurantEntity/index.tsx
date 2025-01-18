function RestaurantEntity({ data }: any) {
    return (
        <div>
            <h1>{data.title}</h1>
            <p>{data.description}</p>
        </div>
    )
}

export default RestaurantEntity;