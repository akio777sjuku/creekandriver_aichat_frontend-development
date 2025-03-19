import React, { useEffect, useState } from "react";
import { Space, Table, message, Button, Form, Row, Col, Select, Input, theme, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";
import { fileApi } from "../../api";

export interface FileDataType {
    id: string;
    name: string;
    chat_id: string;
    chat_type: string;
    file_url: string;
    file_size_mb: number;
    status: string;
    folder_id: string;
    category: string;
    created_by: string;
    created_at: string;
}

export function Component(): JSX.Element {
    const [data, setData] = useState<FileDataType[]>([]);
    const [deleteFileId, setDeleteFileId] = useState("");

    function size_convert(bite: number, decimal: number) {
        decimal = decimal ? Math.pow(10, decimal) : 10;
        let kiro = 1024;
        let size = bite;
        let unit = "B";
        let units = ["B", "KB", "MB", "GB", "TB"];
        for (var i = units.length - 1; i > 0; i--) {
            if (bite / Math.pow(kiro, i) > 1) {
                size = Math.round((bite / Math.pow(kiro, i)) * decimal) / decimal;
                unit = units[i];
                break;
            }
        }
        return String(size) + " " + unit;
    }

    const delete_file = async (file_id: string) => {
        try {
            setDeleteFileId(file_id);
            await fileApi.deleteFile(file_id);
            message.success("ファイルを削除しました。");
            search_file();
        } catch (e) {
            message.error("ファイルの削除を失敗しました。");
        } finally {
            setDeleteFileId("");
        }
    };

    const search_file = async () => {
        try {
            const file_list: FileDataType[] = await fileApi.getFiles();
            setData(file_list);
        } catch (e) {
            message.error("ファイルリストの取得を失敗しました。");
        }
    };

    const download_file = async (file_id: string, file_name: string) => {
        try {
            await fileApi.downloadFile(file_id, file_name);
        } catch (e) {
            message.error("ファイルのダウンロードに失敗しました");
        }
    };

    const columns: ColumnsType<FileDataType> = [
        {
            title: "ファイル名",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "サイズ",
            dataIndex: "file_size_mb",
            key: "file_size_mb",
            render: (value: number) => size_convert(value * 1024 * 1024, 2)
        },
        {
            title: "種別",
            dataIndex: "chat_type",
            key: "chat_type",
            render: (value: string) => (value === "gpt" ? "AIチャット" : "社内データ")
        },
        {
            title: "カテゴリ",
            dataIndex: "category",
            key: "category"
        },
        {
            title: "作成者",
            dataIndex: "created_by",
            key: "created_by"
        },
        {
            title: "作成時間",
            dataIndex: "created_at",
            key: "created_at"
        },
        {
            title: "操作",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        disabled={deleteFileId === record.id}
                        type="primary"
                        danger
                        onClick={() => {
                            delete_file(record.id);
                        }}
                    >
                        {deleteFileId === record.id ? "削除中" : "削除"}
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            download_file(record.id, record.name);
                        }}
                    >
                        ダウンロード
                    </Button>
                </Space>
            )
        }
    ];

    useEffect(() => {
        search_file();
    }, []);

    return (
        <Row justify="center">
            <Col span={22}>
                <h1>データ一覧</h1>
            </Col>
            <Col span={22}>
                <Table columns={columns} dataSource={data} />
            </Col>
        </Row>
    );
}

Component.displayName = "FileList";
