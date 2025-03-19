import { useState, useEffect } from "react";
import { Button, Input, List, Row, Col, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { PaperClipOutlined, ArrowUpOutlined, DeleteFilled, FileFilled } from "@ant-design/icons";

import styles from "./QuestionInput.module.css";
const { TextArea } = Input;

interface Props {
    chat_id: string;
    onSend: (question: string, files: UploadFile[]) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
}

export const QuestionInput = ({ chat_id, onSend, disabled, placeholder, clearOnSend }: Props) => {
    const [question, setQuestion] = useState<string>("");
    const [composing, setComposition] = useState(false);
    const startComposition = () => setComposition(true);
    const endComposition = () => setComposition(false);

    const sendQuestion = () => {
        if (disabled || !question.trim()) {
            return;
        }
        onSend(question, []);
        if (clearOnSend) {
            setQuestion("");
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

    const sendQuestionDisabled = disabled || !question.trim();

    useEffect(() => {
        setQuestion("");
    }, [chat_id]);

    return (
        <>
            <Row gutter={2} align="middle">
                <Col span={22}>
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
