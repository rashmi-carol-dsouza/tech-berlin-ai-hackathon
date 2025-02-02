const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

export async function getRelevantContentEntities(lat: number, long: number) {
    const requestUrl = new URL(`${BACKEND_API_URL}/local-info/`);
    const response = await fetch(requestUrl.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
         body: JSON.stringify({
            latitude: lat,
            longitude: long,
         }),
    });
    const data = await response.json();
    return {
        entities: Object.values(data['data']['content_entities']),
    }
}