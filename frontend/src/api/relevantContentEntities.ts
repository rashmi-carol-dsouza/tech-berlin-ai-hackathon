
export async function getRelevantContentEntities(lat: number, long: number) {
    const response = await fetch("https://mocki.io/v1/45946f55-1ff9-4742-8da1-ebcc286686bb?lat=" + lat + "&long=" + long);
    const data = await response.json();
    return data;
}