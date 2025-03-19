export type ChatTurn = {
    user: string;
    bot?: string;
};

export type ChatRequest = {
    chat_id: string;
    chat_type: string;
    history: ChatTurn[];
};

export type ChatResponse = {
    answer: string;
    thoughts?: string | null;
    data_points?: string[];
    error?: string;
};

export type ChatContent = {
    chat_id: string;
    index: number;
    question: string;
    answer: string;
};

//--------------------------------------------------

export type AskResponse = {
    answer: string;
    error?: string;
};

export type Response<T> = {
    result: T[];
    error?: string;
};
