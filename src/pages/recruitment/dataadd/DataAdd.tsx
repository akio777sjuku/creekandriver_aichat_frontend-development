import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Typography, Form, Input, Button, Spin, Steps, theme, message, Cascader } from "antd";
import { XFilled } from "@ant-design/icons";
const { Text } = Typography;

import { CompanyDetail, Company } from "../../../components/Company/CompanyDetail";
import { recruitmentApi } from "../../../api";

const steps = [
    {
        title: "企業情報追加",
        key: 1
    },
    {
        title: "求人情報追加",
        key: 2
    },
    {
        title: "求人特徴追加",
        key: 3
    }
];

export function Component() {
    const location = useLocation();
    const { record } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(0);
    const [companyName, setCompanyName] = useState("");
    const [companyInfo, setCompanyInfo] = useState<Company>({
        company_name: "",
        headquarters_location: "",
        capital: "",
        sales: "",
        number_of_employees: "",
        establishment_date: "",
        industry_category: undefined,
        industry_subcategory: undefined,
        listing_status: undefined,
        corporate_philosophy: "",
        business_features: ""
    });

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map(item => ({ key: item.key, title: item.title }));

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                if (location.state) {
                    setLoading(true);
                    const recruitment = location.state;
                    // const responseData = await recruitmentApi.getCompanyInfo(recruitment.company_id);
                }
            } catch (err) {
                message.error("データ取得失敗しました。");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <Spin spinning={loading} tip="処理中..." size="large" fullscreen />
            <Row justify="center">
                <Col span={20}>
                    <h1>データ追加</h1>
                </Col>
            </Row>
            <Row justify={"center"} align={"middle"}>
                <Col span={20}>
                    <Text>
                        <XFilled />
                        データを呼出、文章生成の元情報として利用します
                    </Text>
                </Col>
                {record && (
                    <>
                        <Col span={10}>
                            <h3>{"データ名：" + record.name}</h3>
                        </Col>
                        <Col span={10}>
                            <h3>{"保存日時：" + record.updated_at}</h3>
                        </Col>
                        <Col span={20}>
                            <h3>{"会社名：" + companyName}</h3>
                        </Col>
                    </>
                )}
            </Row>
            <Row justify="center" style={{ paddingBottom: 20 }}>
                <Col span={20}>
                    <Steps current={current} items={items} style={{ padding: 30 }} />
                </Col>
                <Col span={20}>
                    {steps[current].key === 1 && <CompanyDetail companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />}
                    <div style={{ marginTop: 24 }}>
                        {current > 0 && (
                            <Button style={{ margin: "0 8px" }} onClick={() => prev()} size="large">
                                戻る
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()} size="large">
                                次へ
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={() => message.success("Processing complete!")} size="large">
                                キャッチ・アピールポイントを生成する
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
        </>
    );
}

Component.displayName = "DataDetail";
