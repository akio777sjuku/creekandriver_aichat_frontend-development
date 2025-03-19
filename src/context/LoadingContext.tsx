import React, { createContext, useContext, useState, ReactNode } from "react";
import { Spin } from "antd";

interface LoadingContextType {
    setLoadingState: (loading: boolean, tip?: string) => void;
    loading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [tip, setTipState] = useState("処理中...");

    const setLoadingState = (newLoading: boolean, newTip: string = "処理中...") => {
        setLoading(newLoading);
        setTipState(newTip);
    };

    return (
        <LoadingContext.Provider value={{ loading, setLoadingState }}>
            <div style={{ position: "relative" }}>
                <Spin
                    fullscreen
                    spinning={loading}
                    tip={tip}
                    size="large"
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        zIndex: 1000
                    }}
                />
                {children}
            </div>
        </LoadingContext.Provider>
    );
};
