function BusinessEntity({ data }: any) {
    return (
        <a href="#" className="block rounded-lg p-4 shadow-sm shadow-indigo-100 bg-white">
            <img
                alt={data.altText}
                src={data.image}
                className="h-56 w-full rounded-md object-cover"
            />

            <div className="mt-2">
                <dl>
                    <div>
                        <dt className="sr-only">Store Name</dt>
                        <dd className="font-medium">{data.title}</dd>
                    </div>
                    <div>
                        <dt className="sr-only">Specialty</dt>
                        <dd className="text-sm text-gray-500">{data.description}</dd>
                    </div>
                </dl>
                <div className="mt-6 flex items-center gap-8 text-xs">
                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                        <svg
                            className="size-4 text-indigo-700"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>

                        <div className="mt-1.5 sm:mt-0">
                            <p className="text-gray-500">Distance</p>

                            <p className="font-medium">{data.distance}</p>
                        </div>
                    </div>

                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                        <svg
                            className="size-4 text-indigo-700"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                            />
                        </svg>


                        <div className="mt-1.5 sm:mt-0">
                            <p className="text-gray-500">Availability</p>

                            <p className="font-medium">{data.availability}</p>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default BusinessEntity;