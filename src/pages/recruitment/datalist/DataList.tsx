import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Row, Col, Space, Table, Button, Spin, Flex, Typography, message } from "antd";
import type { TableProps } from "antd";
import { recruitmentApi } from "../../../api";
import { RecruitmentDataType } from "../datadetail/DataDetail";

const { Column } = Table;
const { Text } = Typography;

type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

export function Component() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [data, setData] = useState<RecruitmentDataType[]>([]);

    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection: TableRowSelection<RecruitmentDataType> = {
        selectedRowKeys,
        onChange: onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const responseData = await recruitmentApi.getExtractedData();
                const parsedData: RecruitmentDataType[] = responseData.map((item: any) => ({
                    key: item.id,
                    id: item.id,
                    name: item.name,
                    company_id: item.company_id,
                    job_info_id: item.job_info_id,
                    employment_type: item.employment_type,
                    updated_by: item.updated_by,
                    updated_at: item.updated_at,
                    created_by: item.created_by,
                    created_at: item.created_at
                }));
                setData(parsedData);
            } catch (err) {
                message.error("データ履歴取得失敗しました。");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return (
        <Row justify="center">
            <Spin spinning={loading} tip="処理中..." size="large" fullscreen />
            <Col span={22}>
                <h1>データ履歴</h1>
                <Text>※1年経過した場合、自動的に削除されます</Text>
            </Col>
            <Col span={22}>
                <Flex align="center" gap="middle" style={{ paddingBottom: 10, paddingTop: 10 }}>
                    <Button type="primary" danger onClick={start} disabled={!hasSelected} loading={loading}>
                        チェックを一括削除
                    </Button>
                    {hasSelected ? `${selectedRowKeys.length} 行データを選択しました。` : null}
                </Flex>
                <Table dataSource={data} rowSelection={{ ...rowSelection }}>
                    <Column
                        title="データ名"
                        dataIndex={"name"}
                        render={(value: string, record: RecruitmentDataType) => <NavLink to={`/recruitment-data/${record.id}`}>{value}</NavLink>}
                    />
                    <Column title="最後更新者" dataIndex="updated_by" key="updated_by" />
                    <Column title="最後更新時刻" dataIndex="updated_at" key="updated_at" />
                    <Column
                        title="操作"
                        key="action"
                        render={(_: any, record: RecruitmentDataType) => (
                            <Space size="middle">
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        navigate("/recruitment-data-add", { state: { record } });
                                    }}
                                >
                                    データ追加
                                </Button>
                                <Button type="primary" danger onClick={() => {}}>
                                    削除
                                </Button>
                            </Space>
                        )}
                    />
                </Table>
            </Col>
        </Row>
    );
}

Component.displayName = "DataList";
