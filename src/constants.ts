export const enum CHAT_TYPE {
    QA = "qa",
    RETRIEVE = "retrieve",
    GPT = "gpt"
}

export const enum OPENAI_MODEL {
    GPT_4O = "gpt-4o"
}

// -------------------------------------------
export const OPENAI_MODEL_LIST = {
    "gpt-35-turbo": "GPT-35",
    "gpt-35-turbo-16k": "GPT-35-16K",
    "gpt-4": "GPT-4",
    "gpt-4-32k": "GPT-4-32K"
};
export const GPT_35_TURBO = "gpt-35-turbo";
export const GPT_35_TURBO_16K = "gpt-35-turbo-16k";
export const GPT_4 = "gpt-4";
export const GPT_4_32K = "gpt-4-32k";

export const enum MENU_TYPE {
    RETRIEVE = "retrievechat",
    GPT = "gptchat",
    FILEMANAGEMENT = "file-management",
    USERINFO = "user-info",
}

export const LOCALSTORAGE_USERID = "user_id";
export const LOCALSTORAGE_USERNAME = "user_name";
export const LOCALSTORAGE_AUTH = "authentication";
export const ACCESS_TOKEN = "access_token"
