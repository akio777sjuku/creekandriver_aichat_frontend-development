import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { initializeIcons } from "@fluentui/react";
import { PublicClientApplication } from "@azure/msal-browser";

import "./index.css";
import PageLayout from "./pages/layout/PageLayout";
import { msalConfig } from "./auth/authconfig";
import { ChatEmpty } from "./components/ChatEmpty";
import { LoadingProvider } from "./context/LoadingContext";
import { setMsalInstance } from "./auth/msalService";

initializeIcons();
const msalInstance = new PublicClientApplication(msalConfig);
setMsalInstance(msalInstance);
const router = createBrowserRouter([
    {
        path: "/",
        element: <PageLayout />,
        children: [
            {
                index: true,
                element: <ChatEmpty />
            },
            // {
            //     path: "recruitment-data-extraction",
            //     lazy: () => import("./pages/recruitment/dataextraction/DataExtraction")
            // },
            // {
            //     path: "recruitment-data-list",
            //     lazy: () => import("./pages/recruitment/datalist/DataList")
            // },
            // {
            //     path: "/recruitment-data-add",
            //     lazy: () => import("./pages/recruitment/dataadd/DataAdd")
            // },
            // {
            //     path: "/recruitment-data/:id",
            //     lazy: () => import("./pages/recruitment/datadetail/DataDetail")
            // },
            {
                path: "retrieve/:chatid",
                lazy: () => import("./pages/retrievechat/RetrieveChat")
            },
            {
                path: "gpt/:chatid",
                lazy: () => import("./pages/chat/Chat")
            },
            {
                path: "retrieve_file_upload",
                lazy: () => import("./pages/fileupload/FileUpload")
            },
            {
                path: "retrieve_file_list",
                lazy: () => import("./pages/filelist/FileList")
            },
            {
                path: "login_history_list",
                lazy: () => import("./pages/userinfolist/UserInfoList")
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <LoadingProvider>
        <MsalProvider instance={msalInstance}>
            <RouterProvider router={router} />
        </MsalProvider>
    </LoadingProvider>

);
