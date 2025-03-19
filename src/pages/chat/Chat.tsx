import { useRef, useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import type { RcFile, UploadFile } from "antd/es/upload/interface";

import { useLoading } from "../../context/LoadingContext";
import styles from "./Chat.module.css";
import * as API from "../../api";
import { chatApi, answerApi, fileApi } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionFileInput } from "../../components/QuestionFileInput";
import { UserChatMessage } from "../../components/UserChatMessage";
import { ChatEmpty } from "../../components/ChatEmpty";
import { OutletContextType } from "../layout/PageLayout";
import { CHAT_TYPE } from "../../constants";

export function Component(): JSX.Element {
    const chat_type = CHAT_TYPE.GPT;
    const params = useParams();
    const chat_id = String(params.chatid);
    const { reloadMenu } = useOutletContext() as OutletContextType;
    const { setLoadingState } = useLoading();

    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<unknown>();

    const [answers, setAnswers] = useState<[string, API.ChatResponse][]>([]);

    const makeApiRequest = async (question: string, files?: UploadFile[]) => {
        lastQuestionRef.current = question;
        error && setError(undefined);
        setIsLoading(true);
        try {
            if (files && files.length > 0) {
                setLoadingState(true, "データ分析中...");
                const formData = new FormData();
                if (files) {
                    files.map((file, index) => {
                        formData.append(`file${index}`, file as RcFile);
                    });
                }
                formData.append("chat_id", chat_id);
                formData.append("chat_type", chat_type);
                formData.append("category", chat_type);
                await fileApi.saveFile(formData);
                setLoadingState(false);
            }
            const history: API.ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: API.ChatRequest = {
                chat_id: chat_id,
                chat_type: chat_type,
                history: [...history, { user: question, bot: undefined }]
            };
            let result = await answerApi.question(request);
            setAnswers([...answers, [question, result]]);
            reloadMenu(chat_type);
        } catch (error) {
            if (error instanceof Error && "statusCode" in error) {
                const typedError = error as Error & { statusCode: number };
                setError(typedError.message);
            } else {
                setError(error);
            }
            setError(error);
        } finally {
            setIsLoading(false);
            setLoadingState(false);
        }
    };

    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setAnswers([]);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await chatApi.getContents(chat_id, chat_type);
                const init_answers: [string, API.ChatResponse][] = res.map(item => {
                    const answer: API.ChatResponse = {
                        answer: item.answer
                    };
                    return [item.question, answer];
                });
                setAnswers(init_answers);
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };
        clearChat();
        fetchData();
    }, [chat_id]);

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);

    return (
        <div className={styles.chatContainer}>
            {answers.length <= 0 && lastQuestionRef.current == "" ? (
                <div className={styles.chatEmptyState}>
                    <ChatEmpty />
                </div>
            ) : (
                <div className={styles.chatMessageStream}>
                    {answers.map((answer, index) => (
                        <div key={index}>
                            <UserChatMessage message={answer[0]} />
                            <div className={styles.chatMessageGpt}>
                                <Answer key={index} answer={answer[1]} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <>
                            <UserChatMessage message={lastQuestionRef.current} />
                            <div className={styles.chatMessageGptMinWidth}>
                                <AnswerLoading />
                            </div>
                        </>
                    )}
                    {error ? (
                        <>
                            <UserChatMessage message={lastQuestionRef.current} />
                            <div className={styles.chatMessageGptMinWidth}>
                                <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                            </div>
                        </>
                    ) : null}
                    <div ref={chatMessageStreamEnd} />
                </div>
            )}

            <div className={styles.chatInput}>
                <QuestionFileInput
                    chat_id={chat_id}
                    clearOnSend
                    placeholder="質問を入力してください。"
                    disabled={isLoading}
                    onSend={(question, fileList) => makeApiRequest(question, fileList)}
                />
            </div>
        </div>
    );
}
Component.displayName = "Chat";
