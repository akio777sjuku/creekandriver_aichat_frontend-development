import httpClient from "./httpClient";
import * as Models from "./models";
import { RecruitmentDataType } from "../pages/recruitment/datadetail/DataDetail";
import { Company, JobInfo } from "../pages/recruitment/dataextraction/DataExtraction";
import { Chat } from "../pages/menulist/MenuList";
import { FileDataType } from "../pages/filelist/FileList";
import { LoginHistoryDataType } from "../pages/userinfolist/UserInfoList";
import { Configuration } from "@azure/msal-browser";

// 認証
export const authApi = {
    setup: async (): Promise<Configuration> => {
        const response = await httpClient.get("api/auth/setup");
        return response.data;
    },
    saveLoginHistory: async () => {
        return await httpClient.post("api/auth/history");
    },
    getLoginHistory: async (): Promise<LoginHistoryDataType[]> => {
        const response = await httpClient.get("api/auth/history");
        return response.data;
    }
};

// 求人サポート
export const recruitmentApi = {
    dataExtraction: async (data: any): Promise<{ company: Company; job_info: JobInfo }> => {
        if (data.extract_type === "1") {
            const formData = new FormData();
            formData.append("file", data.file);
            formData.append("employment_type", data.employment_type);
            formData.append("extract_type", data.extract_type);
            return await httpClient.post("api/recruitments/file", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } else {
            return await httpClient.post("api/recruitments/url", data);
        }
    },
    saveExtractedData: async (data: any) => {
        return await httpClient.post("api/recruitments", data);
    },
    getExtractedData: async (): Promise<RecruitmentDataType[]> => {
        return await httpClient.get("api/recruitments");
    }
};

// チャット
export const chatApi = {
    createChat: async (data: any): Promise<Chat> => {
        const response = await httpClient.post("api/chats", data);
        return response.data;
    },
    deleteChat: async (chat_id: string, chat_type: string) => {
        const response = await httpClient.delete(`api/chats/${chat_id}`, { params: { chat_type: chat_type } });
        return response.data;
    },
    updateChat: async (chat_id: string, update_data: Partial<Chat>): Promise<Chat> => {
        const response = await httpClient.put(`api/chats/${chat_id}`, update_data);
        return response.data;
    },
    getAllChats: async () => {
        const response = await httpClient.get("api/chats");
        return response.data;
    },
    getContents: async (chat_id: string, chat_type: string): Promise<Models.ChatContent[]> => {
        const response = await httpClient.get(`api/chats/content/${chat_id}`, { params: { chat_type: chat_type } });
        return response.data;
    }
};

// 問題解析
export const answerApi = {
    question: async (data: Models.ChatRequest): Promise<Models.ChatResponse> => {
        const response = await httpClient.post(
            "api/answers",
            JSON.stringify({
                chat_id: data.chat_id,
                chat_type: data.chat_type,
                history: data.history
            })
        );
        return response.data;
    }
};

// ファイル管理
export const fileApi = {
    saveFile: async (formData: FormData): Promise<Models.ChatResponse> => {
        const response = await httpClient.post("api/files", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    },
    getFiles: async (): Promise<FileDataType[]> => {
        const response = await httpClient.get("api/files");
        return response.data;
    },
    deleteFile: async (file_id: string) => {
        const response = await httpClient.delete(`api/files/${file_id}`);
        return response.data;
    },
    downloadFile: async (file_id: string, file_name: string) => {
        const response = await httpClient.get(`api/files/${file_id}`, {
            responseType: "blob",
            params: { file_name: file_name }
        });
        // Create a Blob object from the response data
        const fileBlob = new Blob([response.data]);

        // Create a temporary anchor element
        const link = document.createElement("a");
        const url = URL.createObjectURL(fileBlob);
        link.href = url;

        // Set the download attribute with the file name
        const contentDisposition = response.headers["content-disposition"];
        let fileName = file_name; // Default to the file_id

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match?.[1]) {
                fileName = match[1];
            }
        }

        link.download = fileName;
        document.body.appendChild(link);

        // Programmatically trigger the click event to start the download
        link.click();

        // Clean up the URL object and remove the anchor
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }
};
