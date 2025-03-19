import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { Layout, theme } from "antd";
import { Col, Row, Button, Affix, message } from "antd";
import { Persona, PersonaSize } from "@fluentui/react/lib/Persona";

import MenuList from "../menulist/MenuList";
import LogoImage from "../../assets/cr_logo.svg";
import { loginRequest } from "../../auth/authconfig";
import { authApi, chatApi } from "../../api";
import { CHAT_TYPE, ACCESS_TOKEN } from "../../constants";
import { Chat } from "../menulist/MenuList";

const { Header, Content, Footer, Sider } = Layout;
export interface OutletContextType {
    reloadMenu: (type: string) => void;
}

const PageLayout: React.FC = () => {
    const { instance, accounts } = useMsal();
    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();
    const navigate = useNavigate();
    const [gptChatlist, setGptChatList] = useState<Chat[]>([]);
    const [retrieveChatlist, setRetrieveChatList] = useState<Chat[]>([]);

    const handleLogin = async () => {
        await instance
            .loginPopup(loginRequest)
            .then(async res => {
                sessionStorage.setItem(ACCESS_TOKEN, res.accessToken);
                await authApi.saveLoginHistory();
            })
            .catch(e => {
                message.error(e);
            });
    };

    const handleLogout = async () => {
        navigate("/");
        localStorage.clear();
        sessionStorage.clear();
        await instance.logoutPopup();
        navigate("/");
    };

    const reloadMenu = async (type: string) => {
        try {
            const chats = await chatApi.getAllChats();
            if (type === CHAT_TYPE.GPT) {
                setGptChatList(chats[CHAT_TYPE.GPT]);
            }
            if (type === CHAT_TYPE.RETRIEVE) {
                setRetrieveChatList(chats[CHAT_TYPE.RETRIEVE]);
            }
        } catch (error) {
            message.error("チャットリストの取得を失敗しました。");
        }
    };

    return (
        <Layout style={{ height: "100vh" }}>
            <Header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    width: "100%",
                    height: "70px",
                    display: "flex",
                    alignItems: "center",
                    background: "#dbdbdb"
                }}
            >
                <Row style={{ height: 64, width: "100%" }} justify="space-between">
                    <Col span={6}>
                        <NavLink to={"/"}>
                            <img style={{ height: 54 }} src={LogoImage} alt="justcareer_logo" />
                        </NavLink>
                    </Col>
                    <Col span={6}>
                        <Row style={{ height: 64 }} align="middle" justify="end">
                            {accounts.length > 0 ? (
                                <>
                                    <Persona
                                        text={accounts[0] && accounts[0].name}
                                        secondaryText={accounts[0] && accounts[0].username}
                                        size={PersonaSize.size32}
                                    />
                                    <Button type="primary" onClick={handleLogout}>
                                        サインアウト
                                    </Button>
                                </>
                            ) : (
                                <Button type="primary" onClick={handleLogin}>
                                    サインイン
                                </Button>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Header>
            <Layout hasSider>
                {accounts.length > 0 && (
                    <>
                        <Sider
                            theme="light"
                            width={260}
                            style={{
                                overflow: "auto",
                                height: "100vh",
                                position: "fixed",
                                left: 0,
                                top: 0,
                                paddingTop: 94
                            }}
                        >
                            <MenuList
                                gptChatlist={gptChatlist}
                                retrieveChatlist={retrieveChatlist}
                                setGptChatList={setGptChatList}
                                setRetrieveChatList={setRetrieveChatList}
                            />
                        </Sider>
                    </>
                )}

                <Layout className="site-layout" style={{ marginLeft: accounts.length > 0 ? 260 : undefined }}>
                    <Content style={{ margin: "24px 24px 12px 24px", overflow: "auto", background: colorBgContainer, borderRadius: borderRadiusLG }}>
                        <Outlet context={{ reloadMenu }} />
                    </Content>
                    <Affix offsetBottom={0}>
                        <Footer style={{ textAlign: "center", height: 40, padding: 5 }}>© CREEK & RIVER Co., Ltd.</Footer>
                    </Affix>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default PageLayout;
