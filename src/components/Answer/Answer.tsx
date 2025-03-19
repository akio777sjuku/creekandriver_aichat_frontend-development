import { Row, Col } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "./Answer.module.css";
import { AskResponse } from "../../api";
import { AnswerIcon } from "./AnswerIcon";

interface Props {
    answer: AskResponse;
}

export const Answer = ({ answer }: Props) => {
    return (
        <div className={`${styles.answerContainer}`}>
            <Row justify="space-between" style={{ marginBottom: '5px' }}>
                <Col span={24}>
                    <AnswerIcon />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <ReactMarkdown className={`${styles.markdown}`} remarkPlugins={[remarkGfm]}>
                        {answer.answer}
                    </ReactMarkdown>
                </Col>
            </Row>
        </div>
    );
};