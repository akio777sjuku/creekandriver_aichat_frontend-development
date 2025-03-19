import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
import { Button, Form, Input, Radio, Upload, Spin, Modal, Typography, message } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";

import { recruitmentApi } from "../../../api";

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

export type Company = {
    id?: string;
    company_name: string;
    headquarters_location: string;
    capital: string;
    sales: string;
    number_of_employees: string;
    establishment_date: string;
    listing_status: string;
    industry: string;
};

export type JobInfo = {
    id?: string;
    recruitment_features: string;
    recruitment_position: string;
    position: string;
    english_usage_scenes: string;
    applicable_qualifications: string;
    selection_process: string;
    organization_structure: string;
    application_requirements: string;
    employment_type: string;
    probation_period: string;
    changes_in_working_conditions: string;
    work_location: string;
    nearest_station: string;
    annual_income: string;
    wage_form: string;
    overtime_allowance: string;
    fixed_overtime_hours: string;
    base_salary_excluding_fixed_overtime: string;
    salary_system_notes: string;
    working_hours: string;
    break_time_minutes: string;
    working_hours_notes: string;
    overtime_hours_in_normal_time: string;
    discretionary_labor_system: string;
    holidays_and_vacations: string;
    welfare_benefits: string;
    measures_against_passive_smoking: string;
};
export function Component() {
    const navigate = useNavigate();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [extractType, setExtractType] = useState("0");
    const [loading, setLoading] = useState(false);
    const [companyInfo, setCompanyInfo] = useState<Company>();
    const [jobInfo, setJobInfo] = useState<JobInfo>();
    const [openSaveModal, setOpenSaveModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [dataName, setDataName] = useState("");
    const [saveDataError, setSaveDataError] = useState("");
    const initialValues = {
        url: "https://career.jusnet.co.jp/search/detail.php?kno=JS0001148",
        employment_type: "1",
        extract_type: "0"
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            if (values.extract_type === "1") {
                if (fileList.length > 0) {
                    values.file = fileList[0];
                }
            }
            const extracted_data = await recruitmentApi.dataExtraction(values);
            setCompanyInfo(extracted_data.company);
            setJobInfo(extracted_data.job_info);
        } catch (e: unknown) {
            message.error("データ抽出エラーを発生しました。エラーメッセージ：" + e);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDataOnClick = () => {
        setDataName("");
        setSaveDataError("");
        setOpenSaveModal(true);
    };

    const handleSaveData = async () => {
        setSaveDataError("");
        if (!dataName) {
            setSaveDataError("データ名は必須項目です。");
            return;
        }
        setConfirmLoading(true);
        try {
            await recruitmentApi.saveExtractedData({ dataName, companyInfo, jobInfo });
            setOpenSaveModal(false);
            message.success("抽出データを保存しました。");
            navigate("/recruitment-data-list");
        } catch (error) {
            if (error instanceof Error && "statusCode" in error) {
                const typedError = error as Error & { statusCode: number };
                if (typedError.statusCode === 409) {
                    setSaveDataError(typedError.message);
                } else {
                    message.error(typedError.message);
                }
            } else {
                message.error("抽出データを保存失敗しました。");
                console.log("予想以外のエラーを発生しました。:", error);
            }
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCancelSaveData = () => {
        if (!confirmLoading) {
            setDataName("");
            setSaveDataError("");
            setOpenSaveModal(false);
        }
    };

    const onJobInfoChange = (field: keyof JobInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
        // setJobInfo({ ...jobInfo, [field]: e.target.value });
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
        accept: ".pdf, .txt, .docx"
    };

    return (
        <Row justify="center">
            <Spin spinning={loading} tip="処理中..." size="large" fullscreen />
            <Col span={18}>
                <h1>データ抽出・保存</h1>
                <Form name="nest-messages" onFinish={onFinish} initialValues={initialValues}>
                    <Form.Item layout="horizontal" name={"employment_type"} label="雇用形態" rules={[{ required: true }]}>
                        <Radio.Group>
                            <Radio value="0"> 正社員 </Radio>
                            <Radio value="1"> 派遣 </Radio>
                            <Radio value="2"> 紹介予定派遣 </Radio>
                            <Radio value="3"> アルバイト </Radio>
                            <Radio value="4"> 業務委託 </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item layout="horizontal" name={"extract_type"} label="抽出タイプ" rules={[{ required: true }]}>
                        <Radio.Group
                            onChange={(e: any) => {
                                setExtractType(e.target.value);
                            }}
                        >
                            <Radio value="0"> URL </Radio>
                            <Radio value="1"> ファイル </Radio>
                        </Radio.Group>
                    </Form.Item>
                    {extractType === "0" && (
                        <Form.Item name={"url"} label="URL">
                            <Input />
                        </Form.Item>
                    )}
                    {extractType === "1" && (
                        <Form.Item label="ファイル" valuePropName="fileList" name="file" getValueFromEvent={normFile}>
                            <Upload {...props}>
                                <Button icon={<UploadOutlined />}>選択...</Button>
                            </Upload>
                        </Form.Item>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            データ抽出
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
            {companyInfo && jobInfo && (
                <Col span={18}>
                    <Row justify="center" style={{ background: "#002060" }}>
                        <h3 style={{ margin: 5, color: "#ffffff" }}>企業情報</h3>
                    </Row>
                    <Row align="middle" justify={"center"}>
                        <Col span={24}>
                            <Form layout="horizontal" style={{ paddingTop: 20 }}>
                                <Form.Item label="会社名" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={companyInfo.company_name} onChange={() => {}} />
                                </Form.Item>
                                <Form.Item label="本社所在地" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={companyInfo.headquarters_location} onChange={() => {}} />
                                </Form.Item>
                                <Form.Item label="資本金" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={companyInfo.capital} onChange={() => {}} />
                                </Form.Item>
                                <Form.Item label="売上高" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={companyInfo.sales} onChange={() => {}} />
                                </Form.Item>
                                <Form.Item label="従業員数" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={companyInfo.number_of_employees} onChange={() => {}} />
                                </Form.Item>
                                <Form.Item label="設立" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={companyInfo.establishment_date} onChange={() => {}} />
                                </Form.Item>
                                <Form.Item label="上場区分" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={companyInfo.listing_status} onChange={() => {}} />
                                </Form.Item>
                                <Form.Item label="業種" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={companyInfo.industry} onChange={() => {}} />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row justify="center" style={{ background: "#002060" }}>
                        <h3 style={{ margin: 5, color: "#ffffff" }}>求人情報</h3>
                    </Row>
                    <Row align="middle" justify={"center"}>
                        <Col span={24}>
                            <Form layout="horizontal" style={{ paddingTop: 20 }}>
                                <Form.Item label="求人特徴" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.recruitment_features} onChange={onJobInfoChange("recruitment_features")} />
                                </Form.Item>
                                <Form.Item label="募集職種" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.recruitment_position} onChange={onJobInfoChange("recruitment_position")} />
                                </Form.Item>
                                <Form.Item label="ポジション" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.position} onChange={onJobInfoChange("position")} />
                                </Form.Item>
                                <Form.Item label="英語利用場面" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.english_usage_scenes} onChange={onJobInfoChange("english_usage_scenes")} />
                                </Form.Item>
                                <Form.Item label="活かせる資格" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.applicable_qualifications} onChange={onJobInfoChange("applicable_qualifications")} />
                                </Form.Item>
                                <Form.Item label="選考過程" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.selection_process} onChange={onJobInfoChange("selection_process")} />
                                </Form.Item>
                                <Form.Item label="組織構成" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.organization_structure} onChange={onJobInfoChange("organization_structure")} />
                                </Form.Item>
                                <Form.Item label="応募要件" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.application_requirements} onChange={onJobInfoChange("application_requirements")} />
                                </Form.Item>
                                <Form.Item label="雇用形態" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.employment_type} onChange={onJobInfoChange("employment_type")} />
                                </Form.Item>
                                <Form.Item label="試用期間" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.probation_period} onChange={onJobInfoChange("probation_period")} />
                                </Form.Item>
                                <Form.Item label="労働条件変更点" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.changes_in_working_conditions} onChange={onJobInfoChange("changes_in_working_conditions")} />
                                </Form.Item>
                                <Form.Item label="勤務地" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.work_location} onChange={onJobInfoChange("work_location")} />
                                </Form.Item>
                                <Form.Item label="最寄駅" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.nearest_station} onChange={onJobInfoChange("nearest_station")} />
                                </Form.Item>
                                <Form.Item label="年収" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.annual_income} onChange={onJobInfoChange("annual_income")} />
                                </Form.Item>
                                <Form.Item label="賃金形態" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.wage_form} onChange={onJobInfoChange("wage_form")} />
                                </Form.Item>
                                <Form.Item label="残業代" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.overtime_allowance} onChange={onJobInfoChange("overtime_allowance")} />
                                </Form.Item>
                                <Form.Item label="固定残業時間" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.fixed_overtime_hours} onChange={onJobInfoChange("fixed_overtime_hours")} />
                                </Form.Item>
                                <Form.Item label="固定残業代を除いた基本給" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input
                                        value={jobInfo.base_salary_excluding_fixed_overtime}
                                        onChange={onJobInfoChange("base_salary_excluding_fixed_overtime")}
                                    />
                                </Form.Item>
                                <Form.Item label="給与制度備考" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.salary_system_notes} onChange={onJobInfoChange("salary_system_notes")} />
                                </Form.Item>
                                <Form.Item label="勤務時間" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.working_hours} onChange={onJobInfoChange("working_hours")} />
                                </Form.Item>
                                <Form.Item label="休憩時間(分)" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input type="number" value={jobInfo.break_time_minutes} onChange={onJobInfoChange("break_time_minutes")} />
                                </Form.Item>
                                <Form.Item label="勤務時間備考" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.working_hours_notes} onChange={onJobInfoChange("working_hours_notes")} />
                                </Form.Item>
                                <Form.Item label="残業時間(通常時)" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.overtime_hours_in_normal_time} onChange={onJobInfoChange("overtime_hours_in_normal_time")} />
                                </Form.Item>
                                <Form.Item label="裁量労働有無" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.discretionary_labor_system} onChange={onJobInfoChange("discretionary_labor_system")} />
                                </Form.Item>
                                <Form.Item label="休日・休暇" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.holidays_and_vacations} onChange={onJobInfoChange("holidays_and_vacations")} />
                                </Form.Item>
                                <Form.Item label="福利厚生" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.welfare_benefits} onChange={onJobInfoChange("welfare_benefits")} />
                                </Form.Item>
                                <Form.Item label="受動喫煙防止措置に関する事項" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <Input value={jobInfo.measures_against_passive_smoking} onChange={onJobInfoChange("measures_against_passive_smoking")} />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row align="middle" justify={"center"}>
                        <Button type="primary" size="large" onClick={handleSaveDataOnClick}>
                            名前を付けて保存する
                        </Button>
                    </Row>
                    <Modal
                        title="名前を付けて保存"
                        open={openSaveModal}
                        onOk={handleSaveData}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancelSaveData}
                        keyboard={false}
                        maskClosable={false}
                        cancelText="キャンセル"
                        okText="確定"
                    >
                        <Input
                            value={dataName}
                            allowClear={true}
                            placeholder="データ名を入力してください。"
                            onChange={e => {
                                setDataName(e.target.value);
                            }}
                            status={saveDataError ? "error" : ""}
                        />
                        {saveDataError && <Typography.Text type="danger">{saveDataError}</Typography.Text>}
                    </Modal>
                </Col>
            )}
        </Row>
    );
}

Component.displayName = "DataExtraction";
