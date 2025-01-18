import { createContext, useContext, useState, ReactNode } from "react";

type ViewState = "findNearby" | "askQuestion";

interface ViewContextProps {
    viewState: ViewState;
    setViewState: (view: ViewState) => void;
}

const ViewContext = createContext<ViewContextProps | undefined>(undefined);

export const useViewContext = () => {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error("useViewContext must be used within a ViewProvider");
    }
    return context;
};

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [viewState, setViewState] = useState<ViewState>("findNearby");

    return (
        <ViewContext.Provider value={{ viewState, setViewState }}>
            {children}
        </ViewContext.Provider>
    );
};
