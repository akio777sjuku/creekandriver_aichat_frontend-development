import { Row, Col, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import styles from "./Answer.module.css";

interface Props {
    error: string;
    onRetry: () => void;
}

export const AnswerError = ({ error, onRetry }: Props) => {
    return (
        <div className={styles.answerContainer}>
            <Row justify="space-between" align="middle">
                <Col>
                    <ExclamationCircleOutlined style={{ color: 'red', fontSize: '24px' }} aria-hidden="true" aria-label="Error icon" />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <p className={styles.answerText}>{error}</p>
                </Col>
            </Row>
            <Row justify="end">
                <Col>
                    <Button className={styles.retryButton} type="primary" onClick={onRetry}>
                        再試行
                    </Button>
                </Col>
            </Row>
        </div>
    );
};