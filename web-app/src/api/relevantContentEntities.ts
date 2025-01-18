
const API_ENDPOINT = "http://localhost:4000/relevant-entities";

export async function getRelevantContentEntities(lat: number, long: number, query?: string) {
    const response = await fetch(`${API_ENDPOINT}?lat=${lat}&long=${long}&query=${query}`);
    const data = await response.json();
    return data[0];
}