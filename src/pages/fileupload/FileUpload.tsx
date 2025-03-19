import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Row, Col, Form, Input, Button, message, Upload, Space } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useMsal } from "@azure/msal-react";

import { useLoading } from "../../context/LoadingContext";
import { fileApi } from "../../api";
import { CHAT_TYPE } from "../../constants";

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

export function Component(): JSX.Element {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const { accounts } = useMsal();
    const userName = accounts[0] && accounts[0].username;
    const { setLoadingState } = useLoading();

    const handleUpload = async (values: any) => {
        try {
            setLoadingState(true);
            setUploading(true);
            const formData = new FormData();
            formData.append("file", fileList[0] as RcFile);
            formData.append("chat_id", CHAT_TYPE.RETRIEVE);
            formData.append("chat_type", CHAT_TYPE.RETRIEVE);
            formData.append("category", values["category"] ? values["category"] : "");

            await fileApi.saveFile(formData);
            message.success("ファイルをアップロードしました。");
            setFileList([]);
        } catch (error) {
            message.error("ファイルをアップロード失敗しました。");
        } finally {
            setLoadingState(false);
            setUploading(false);
        }
    };

    const props: UploadProps = {
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: file => {
            setFileList([file]);
            return false;
        },
        fileList,
        maxCount: 1,
        accept: ".xlsx, .pdf, .csv, .txt, .docx"
    };

    const filterOption = (input: string, option?: { label: string; value: string }) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

    return (
        <Row justify="center">
            <Col span={18}>
                <h1>社内データアップロード</h1>
                <Form layout="horizontal" onFinish={handleUpload} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} style={{ width: 600 }}>
                    <Form.Item label="操作者">{userName}</Form.Item>
                    {/* <Form.Item label="フォルダ" name="folder_id">
                        <Select
                            showSearch
                            filterOption={filterOption}
                            placeholder="フォルダを選択してください。"
                            dropdownRender={menu => (
                                <>
                                    <Divider style={{ margin: "8px 0" }} />
                                    <Space style={{ padding: "0 8px 4px" }}>
                                        <Input placeholder="フォルダ名" value={name} onChange={onNameChange} onKeyDown={e => e.stopPropagation()} />
                                        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                            新規フォルダ
                                        </Button>
                                    </Space>
                                    {menu}
                                </>
                            )}
                            options={items.map(item => ({ label: item.value, value: item.key }))}
                        />
                    </Form.Item> */}
                    <Form.Item label="タグ（任意）" name="category">
                        <Input />
                    </Form.Item>
                    <Form.Item label="ファイル" valuePropName="fileList" name="file" getValueFromEvent={normFile}>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
                        <Space>
                            <Button disabled={fileList.length === 0} loading={uploading} type="primary" htmlType="submit">
                                {uploading ? "アップロード中..." : "アップロード"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}
Component.displayName = "FileUpload";
