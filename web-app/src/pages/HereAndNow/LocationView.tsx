import { Coordinates } from "../../context/Location";

type LocationViewProps = {
    coordinates: Coordinates;
};
function LocationView({ coordinates }: LocationViewProps) {
    return (
        <article
            className="mb-5 rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5"
        >
            <div className="rounded-[10px] bg-white p-2 sm:p-4">
                <time dateTime={new Date().toISOString()} className="block text-xs text-gray-500">
                    {new Date().toLocaleString()}
                </time>
                <p className="mt-0.5 font-medium text-gray-900">
                    Latitude: {coordinates.lat}, Longitude: {coordinates.long}
                </p>
            </div>
        </article>
    );
}

export default LocationView;