import { useState, useEffect } from "react";
import { Button, Input, List, Row, Col, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { PaperClipOutlined, ArrowUpOutlined, DeleteFilled, FileFilled } from "@ant-design/icons";

import styles from "./QuestionFileInput.module.css";
const { TextArea } = Input;

interface Props {
    chat_id: string;
    onSend: (question: string, files: UploadFile[]) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
}

export const QuestionFileInput = ({ chat_id, onSend, disabled, placeholder, clearOnSend }: Props) => {
    const [question, setQuestion] = useState<string>("");
    const [composing, setComposition] = useState(false);
    const startComposition = () => setComposition(true);
    const endComposition = () => setComposition(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const props: UploadProps = {
        onRemove: file => {
            const newFileList = fileList.filter(item => item.uid !== file.uid);
            setFileList(newFileList);
        },
        beforeUpload: file => {
            setFileList([...fileList, file]);
            return false;
        },
        showUploadList: false,
        accept: ".csv, .pdf, .txt, .docx, .xlsx, .jpg, .png"
    };

    const sendQuestion = () => {
        if (disabled || !question.trim()) {
            return;
        }
        onSend(question, fileList);
        if (clearOnSend) {
            setQuestion("");
            setFileList([]);
        }
    };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
        if (ev.key === "Enter" && !ev.shiftKey && !composing) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const onQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (!newValue) {
            setQuestion("");
        } else if (newValue.length <= 10000) {
            setQuestion(newValue);
        }
    };

    const handleRemove = (file: UploadFile) => {
        const newFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(newFileList);
    };

    const sendQuestionDisabled = disabled || !question.trim();

    useEffect(() => {
        setQuestion("");
        setFileList([]);
    }, [chat_id]);

    return (
        <>
            <Row gutter={2} align="middle">
                <Col span={2} className={styles.questionInputButtonsContainer}>
                    <Upload {...props}>
                        <Button icon={<PaperClipOutlined />} shape="circle"></Button>
                    </Upload>
                </Col>
                <Col span={20}>
                    <TextArea
                        value={question}
                        onChange={onQuestionChange}
                        onKeyDown={onEnterPress}
                        onCompositionStart={startComposition}
                        onCompositionEnd={endComposition}
                        placeholder={placeholder}
                        autoSize={{ minRows: 1, maxRows: 5 }}
                        disabled={disabled}
                        className={styles.questionInputTextArea}
                    />
                    {fileList.length > 0 && (
                        <List
                            size="small"
                            style={{ color: "black", marginTop: "8px" }}
                            locale={{ emptyText: undefined }}
                            dataSource={fileList}
                            renderItem={item => (
                                <List.Item style={{ padding: 0, display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <FileFilled style={{ paddingLeft: "8px", paddingRight: "5px" }} />
                                        <span style={{ color: "black" }}>{item.name}</span>
                                    </div>
                                    <Button size="small" icon={<DeleteFilled />} shape="circle" onClick={() => handleRemove(item)} />
                                </List.Item>
                            )}
                        />
                    )}
                </Col>
                <Col span={2} className={styles.questionInputButtonsContainer}>
                    <div
                        className={`${styles.questionInputSendButton} ${sendQuestionDisabled ? styles.questionInputSendButtonDisabled : ""}`}
                        aria-label="Ask question button"
                    >
                        <Button type="primary" shape="circle" icon={<ArrowUpOutlined />} onClick={sendQuestion} />
                    </div>
                </Col>
            </Row>
        </>
    );
};
