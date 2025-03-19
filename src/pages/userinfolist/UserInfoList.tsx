import { useEffect, useState } from "react";
import { Table, message } from "antd";
import { useMsal } from "@azure/msal-react";
import type { ColumnsType } from "antd/es/table";
import styles from "./UserInfoList.module.css";
import { authApi } from "../../api";

export interface LoginHistoryDataType {
    id: string;
    user_name: string;
    user_id: string;
    login_time: string;
}

export function Component(): JSX.Element {
    const [data, setData] = useState<LoginHistoryDataType[]>([]);

    const getDataList = async () => {
        try {
            const api_res: LoginHistoryDataType[] = await authApi.getLoginHistory();
            setData(api_res);
        } catch (e) {
            message.error("ログイン履歴の取得を失敗しました。");
        }
    };

    useEffect(() => {
        getDataList();
    }, []);

    const columns: ColumnsType<LoginHistoryDataType> = [
        {
            title: "ユーザー名",
            dataIndex: "user_name",
            key: "user_name"
        },
        {
            title: "ログインID",
            dataIndex: "user_id",
            key: "user_id"
        },
        {
            title: "ログイン時刻",
            dataIndex: "login_time",
            key: "login_time"
        }
    ];

    return (
        <div className={styles.FileListContainer}>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}

Component.displayName = "UserInfoList";
