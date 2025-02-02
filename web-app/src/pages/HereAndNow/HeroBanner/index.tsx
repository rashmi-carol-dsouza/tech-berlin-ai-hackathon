import LocationView from "../LocationView";

function HeroBanner({ coordinates }: any) {
    return (
        <section className="bg-gray-50 animate-pulse">
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
                <div className="mx-auto max-w-xl text-center">
                    <h1 className="text-3xl font-extrabold sm:text-5xl">
                        Discover what's
                        <strong className="font-extrabold text-red-700 sm:block"> Around You. </strong>
                    </h1>

                    <div className="mt-8">
                        <LocationView coordinates={coordinates} />
                    </div>

                    <p className="mt-4 sm:text-xl/relaxed">
                        Loading...
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HeroBanner;