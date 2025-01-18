type MessagesProps = {
    messages: { id: number; text: string }[];
    isLoading: boolean;
    isError: boolean;
    error: any;
    queryInput?: string;
};

function Messages({ messages, isLoading, isError, error, queryInput }: MessagesProps) {
    if (isLoading) {
        return <p className="text-gray-500 italic">Loading messages...</p>;
    }

    if (isError) {
        return <p className="text-red-500">Error: {error.message}</p>;
    }

    if (!queryInput) {
        return <p className="text-gray-400">Type something and press enter to start your search.</p>;
    }

    if (messages.length === 0) {
        return <p className="text-gray-500 italic">No results found for your query.</p>;
    }

    return (
        <ul className="space-y-2">
            {messages.map((message) => (
                <li key={message.id} className="p-2 border rounded-md shadow-sm">
                    {message.text}
                </li>
            ))}
        </ul>
    );
}

export default Messages;
