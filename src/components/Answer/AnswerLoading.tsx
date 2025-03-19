import { Row, Col, Skeleton } from "antd";
import styles from "./Answer.module.css";
import { AnswerIcon } from "./AnswerIcon";

export const AnswerLoading = () => {
    return (
        <div className={styles.answerContainer}>
            <Row justify="space-between" style={{ marginBottom: '5px' }}>
                <Col span={24}>
                    <AnswerIcon />
                </Col>
            </Row>
            <Row style={{ marginBottom: '5px' }}>
                <Col>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: 400 }}>
                        生成中
                        <span className={styles.loadingdots} />
                    </p>
                </Col>
                <Col span={24}>
                    <Skeleton active paragraph={{ rows: 2 }} />
                </Col>
            </Row>
        </div>
    );
};