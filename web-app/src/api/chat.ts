import { Message } from '../components/Messages';

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

export async function sendChatMessage(message: string): Promise<Message> {
    const requestUrl = new URL(`${BACKEND_API_URL}/chat/`);
    const response = await fetch(requestUrl.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question: message,
        }),
    });

    if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);

        return {
            id: Math.random(),
            origin: 'bot',
            sentAt: new Date(),
            audio: new Audio(audioUrl)
        };
    }
    
    throw new Error('Error while sending message');
}