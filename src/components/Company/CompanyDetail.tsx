import React, { useState } from "react";
import { Row, Col, Typography, Select, Form, Input } from "antd";
import { XFilled } from "@ant-design/icons";
const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
export type Company = {
    id?: string;
    company_name: string; // 会社名
    headquarters_location: string; // 本社所在地
    capital: string; // 資本金
    sales: string; // 売上高
    number_of_employees: string; // 従業員数
    establishment_date: string; // 設立
    industry_category: number | undefined; // 業種（大分類）
    industry_subcategory: number | undefined; // 業種（小分類）
    listing_status: number | undefined; // 上場区分
    corporate_philosophy: string; // 企業理念、ミッション
    business_features: string; // 事業の特徴
};
interface Category {
    value: number;
    label: string;
    subCategories: Subcategory[];
}
interface Subcategory {
    value: number;
    label: string;
}

interface CompanyDetailProps {
    companyInfo: Company;
    setCompanyInfo: React.Dispatch<React.SetStateAction<Company>>;
}

const industryCategories: Category[] = [
    {
        value: 0,
        label: "IT・情報通信",
        subCategories: [
            { value: 0, label: "情報処理・通信" },
            { value: 1, label: "ソフトウェア・ハードウェア" },
            { value: 2, label: "Web広告・マーケティング" },
            { value: 3, label: "ゲーム・アプリ" },
            { value: 4, label: "放送・管理・映像制作" }
        ]
    },
    {
        value: 1,
        label: "メーカー",
        subCategories: [
            { value: 0, label: "電子・電気機器" },
            { value: 1, label: "精密機器" },
            { value: 2, label: "自動車・輸送用機器" },
            { value: 3, label: "医療機器・医薬品" },
            { value: 4, label: "食品" },
            { value: 5, label: "繊維" },
            { value: 6, label: "化学・石油" },
            { value: 7, label: "鉄鋼金属・非鉄金属" },
            { value: 8, label: "出版・印刷" },
            { value: 9, label: "その他メーカー" }
        ]
    },
    {
        value: 2,
        label: "商社",
        subCategories: [
            { value: 0, label: "総合商社" },
            { value: 1, label: "専門商社" }
        ]
    },
    {
        value: 3,
        label: "物流・運輸・インフラ",
        subCategories: [
            { value: 0, label: "物流・倉庫" },
            { value: 1, label: "運輸（陸運・航空・海運）" },
            { value: 2, label: "インフラ（電気・ガス・エネルギー）" }
        ]
    },
    {
        value: 4,
        label: "サービス",
        subCategories: [
            { value: 0, label: "教育・人材" },
            { value: 1, label: "流通・小売" },
            { value: 2, label: "医療・福祉・介護" },
            { value: 3, label: "その他サービス" }
        ]
    },
    {
        value: 5,
        label: "外資系・税理士法人・コンサル",
        subCategories: [
            { value: 0, label: "アウトソーシング・シェアードサービス" },
            { value: 1, label: "外資系法人" },
            { value: 2, label: "税理士法人・会計事務所" },
            { value: 3, label: "コンサルティングファーム・シンクタンク" },
            { value: 4, label: "その他事務所" }
        ]
    },
    {
        value: 6,
        label: "金融",
        subCategories: [
            { value: 0, label: "銀行・証券・保険" },
            { value: 1, label: "ファンド・VC" },
            { value: 2, label: "その他金融系" }
        ]
    },
    {
        value: 7,
        label: "不動産・建設",
        subCategories: [
            { value: 0, label: "デベロッパー" },
            { value: 1, label: "リノベーション" },
            { value: 2, label: "メンテナンス・設備関連" }
        ]
    },
    {
        value: 8,
        label: "その他",
        subCategories: [
            { value: 0, label: "公法人・特殊法人" },
            { value: 1, label: "地方自治体" },
            { value: 2, label: "その他社会" }
        ]
    }
];

const listingStatusCategories: Subcategory[] = [
    { value: 0, label: "プライム" },
    { value: 1, label: "スタンダード" },
    { value: 2, label: "グロース" },
    { value: 3, label: "大証・名証" },
    { value: 4, label: "その他上場" },
    { value: 5, label: "上場予定" },
    { value: 6, label: "未上場" }
];
export const CompanyDetail: React.FC<CompanyDetailProps> = ({ companyInfo, setCompanyInfo }) => {
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | undefined>(undefined);
    const [selectedlistingStatusCategory, setSelectedlistingStatusCategory] = useState<number | undefined>(undefined);
    const subIndustryCategories = industryCategories.find(cat => cat.value === selectedCategory)?.subCategories || [];
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanyInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCategoryChange = (value: number) => {
        setCompanyInfo(prevState => ({
            ...prevState,
            industry_category: value,
            industry_subcategory: undefined // Reset subcategory when main category changes
        }));
        setSelectedCategory(value);
        setSelectedSubcategory(undefined);
    };

    const handleSubcategoryChange = (value: number) => {
        setCompanyInfo(prevState => ({
            ...prevState,
            industry_subcategory: value
        }));
        setSelectedSubcategory(value);
    };

    const handleListingStatusChange = (value: number) => {
        setCompanyInfo(prevState => ({
            ...prevState,
            listing_status: value
        }));
        setSelectedlistingStatusCategory(value);
    };

    return (
        <>
            <Row justify="center" style={{ background: "#002060" }}>
                <h3 style={{ margin: 5, color: "#FFFFFF" }}>企業情報</h3>
            </Row>
            <Form layout="horizontal" style={{ paddingTop: 20 }}>
                <Row justify="center">
                    <Col span={22}>
                        <Text strong>
                            <XFilled />
                            「事業内容」文章生成の元情報入力してください
                        </Text>
                    </Col>
                </Row>
                <Row align="middle" justify={"center"} style={{ paddingTop: 20 }}>
                    <Text>
                        企業情報として当てはまるキーワードを入力してください。
                        <a href="https://career.jusnet.co.jp/" target="_blank" rel="noopener noreferrer">
                            {"事業内容キーワード集はこちら >>"}
                        </a>
                    </Text>
                </Row>
                <Row align="middle" justify={"center"}>
                    <Text>※企業HPから、文章をコピーして貼り付けでもよいが、キーワードを必ず追加すること。</Text>
                </Row>
                <Row align="middle" justify={"center"}>
                    <Col span={24}>
                        <Form.Item label="①企業理念、ミッション" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                            <TextArea
                                showCount
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    console.log("Change:", e.target.value);
                                }}
                                placeholder="企業理念、ミッションを入力してください。"
                                style={{ height: 120, resize: "none" }}
                            />
                        </Form.Item>
                        <Form.Item label="②事業の特徴" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                            <TextArea
                                showCount
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    console.log("Change:", e.target.value);
                                }}
                                placeholder="事業の特徴を入力してください。"
                                style={{ height: 120, resize: "none" }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="center">
                    <Col span={22}>
                        <Text strong>
                            <XFilled />
                            以下、項目を入力してください
                        </Text>
                    </Col>
                </Row>
                <Row align="middle" justify={"center"}>
                    <Col span={24}>
                        <Form.Item label="会社名" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                            <Input value={companyInfo?.company_name || ""} onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="本社所在地" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                            <Input value={companyInfo?.headquarters_location || ""} onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="資本金" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                            <Input value={companyInfo?.capital || ""} onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="売上高" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                            <Input value={companyInfo?.sales || ""} onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="従業員数" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                            <Input value={companyInfo?.number_of_employees || ""} onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="設立" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                            <Input value={companyInfo?.establishment_date || ""} onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="業種（大分類）" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                            <Select placeholder="大分類を選択してください。" onChange={handleCategoryChange}>
                                {industryCategories.map(category => (
                                    <Option key={category.value} value={category.value}>
                                        {category.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="業種（小分類）" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                            <Select
                                placeholder="小分類を選択してください。"
                                value={selectedSubcategory}
                                onChange={handleSubcategoryChange}
                                disabled={!selectedCategory}
                            >
                                {subIndustryCategories.map(subcategory => (
                                    <Option key={subcategory.value} value={subcategory.value}>
                                        {subcategory.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="上場区分" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                            <Select placeholder="上場区分を選択してください。" value={selectedlistingStatusCategory} onChange={handleListingStatusChange}>
                                {listingStatusCategories.map(category => (
                                    <Option key={category.value} value={category.value}>
                                        {category.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};
