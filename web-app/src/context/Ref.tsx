import { createContext, useContext, RefObject, useRef } from "react";

// Define the type for the ref context
type RefContextType = {
    inputRef: RefObject<HTMLInputElement> | null;
};

// Create the context
const RefContext = createContext<RefContextType | null>(null);

// Custom hook to use the ref context
export const useRefContext = () => {
    const context = useContext(RefContext);
    if (!context) {
        throw new Error("useRefContext must be used within a RefProvider");
    }
    return context;
};

// Provider component
export const RefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const inputRef = useRef<HTMLInputElement>(null); // Create the ref
    return (
        <RefContext.Provider value={{ inputRef }}>
            {children}
        </RefContext.Provider>
    );
};
