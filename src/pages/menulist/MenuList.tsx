import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { Menu, Button, message, Row, Modal, Input, Typography } from "antd";
import {
    PlusCircleOutlined,
    CommentOutlined,
    EditTwoTone,
    DeleteTwoTone,
    UploadOutlined,
    FileSearchOutlined,
    FormOutlined,
    PlusSquareOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";

import { useLoading } from "../../context/LoadingContext";
import { chatApi } from "../../api";
import { CHAT_TYPE, OPENAI_MODEL, MENU_TYPE, LOCALSTORAGE_AUTH } from "../../constants";
import "./style.css";
const { Text } = Typography;

export type Chat = {
    id: string;
    name: string;
    type: string;
    openai_model: string;
    updated_by: string;
    updated_at: string;
    created_by: string;
    created_at: string;
};
interface MenuListProps {
    gptChatlist: Chat[];
    retrieveChatlist: Chat[];
    setGptChatList: React.Dispatch<React.SetStateAction<Chat[]>>;
    setRetrieveChatList: React.Dispatch<React.SetStateAction<Chat[]>>;
}
const { SubMenu } = Menu;

const MenuList: React.FC<MenuListProps> = props => {
    const { accounts } = useMsal();
    const location = useLocation();
    const navigate = useNavigate();
    const { setLoadingState } = useLoading();
    const { gptChatlist, setGptChatList, retrieveChatlist, setRetrieveChatList } = props;
    const userName = accounts[0] && accounts[0].username;
    const [currentChatId, setCurrentChatId] = useState("");
    const [currentChatName, setCurrentChatName] = useState("");
    const [currentChatType, setCurrentChatType] = useState("");
    const [openEdit, setOpenEdit] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    const getMenuLists = async () => {
        setLoadingState(true);
        if (userName) {
            try {
                const chats = await chatApi.getAllChats();
                setGptChatList(chats[CHAT_TYPE.GPT]);
                setRetrieveChatList(chats[CHAT_TYPE.RETRIEVE]);
            } catch (error) {
                message.error("チャットリストの取得を失敗しました。");
            } finally {
                setLoadingState(false);
            }
        }
    };

    const createChat = async (chat_type: string) => {
        setLoadingState(true);
        try {
            const res = await chatApi.createChat(
                JSON.stringify({
                    chat_type: chat_type,
                    openai_model: OPENAI_MODEL.GPT_4O
                })
            );
            message.success("新規チャットを作成しました。");
            if (chat_type === CHAT_TYPE.GPT) {
                setGptChatList([res, ...gptChatlist]);
            }
            if (chat_type === CHAT_TYPE.RETRIEVE) {
                setRetrieveChatList([res, ...retrieveChatlist]);
            }
            setSelectedKeys([res.id]);
            navigate("/" + chat_type + "/" + res.id);
        } catch (error) {
            if (error instanceof Error && "statusCode" in error) {
                const typedError = error as Error & { statusCode: number };
                message.error(typedError.message);
            } else {
                message.error("新規チャットの作成を失敗しました。");
            }
        } finally {
            setLoadingState(false);
        }
    };

    const deleteChat = async (chat_id: string, chat_type: string) => {
        try {
            await chatApi.deleteChat(chat_id, chat_type);
            if (chat_type === CHAT_TYPE.GPT) {
                setGptChatList(prev => prev.filter(chat => chat.id !== chat_id));
            }
            if (chat_type === CHAT_TYPE.RETRIEVE) {
                setRetrieveChatList(prev => prev.filter(chat => chat.id !== chat_id));
            }
            message.success("チャットを削除しました。");
        } catch (error) {
            if (error instanceof Error && "statusCode" in error) {
                const typedError = error as Error & { statusCode: number };
                message.error(typedError.message);
            } else {
                message.error("チャットの削除を失敗しました。");
            }
        } finally {
            setSelectedKeys([]);
            navigate("/");
            setLoadingState(false);
        }
    };

    const saveChatName = async () => {
        setConfirmLoading(true);
        try {
            const newChat = await chatApi.updateChat(currentChatId, { name: currentChatName });
            if (currentChatType === CHAT_TYPE.GPT) {
                setGptChatList(prev => prev.map(chat => (chat.id === currentChatId ? { ...newChat } : chat)));
            }
            if (currentChatType === CHAT_TYPE.RETRIEVE) {
                setRetrieveChatList(prev => prev.map(chat => (chat.id === currentChatId ? { ...newChat } : chat)));
            }
            message.success("チャット名を変更しました。");
        } catch (error) {
            if (error instanceof Error && "statusCode" in error) {
                const typedError = error as Error & { statusCode: number };
                message.error(typedError.message);
            } else {
                message.error("チャット名の変更を失敗しました。");
            }
        } finally {
            setConfirmLoading(false);
            setOpenEdit(false);
        }
    };

    const openEditChatModal = (chat_id: string, chat_type: string, chat_name: string) => {
        setCurrentChatId(chat_id);
        setCurrentChatName(chat_name);
        setCurrentChatType(chat_type);
        setOpenEdit(true);
    };

    const cancelChatName = () => {
        setCurrentChatId("");
        setCurrentChatName("");
        setCurrentChatType("");
        setOpenEdit(false);
    };

    useEffect(() => {
        getMenuLists();
    }, []);

    useEffect(() => {
        // Set open keys based on the current path
        if (location.pathname.includes("recruitment")) {
            setSelectedKeys([location.pathname.replace("/", "")]);
        }
    }, [location.pathname]);

    return (
        <div>
            <Menu
                theme="light"
                mode="inline"
                inlineIndent={6}
                selectedKeys={selectedKeys}
                onClick={(e: any) => {
                    setSelectedKeys([e.key]);
                }}
            >
                {/* <SubMenu className="primary-menu-item" key="recruitment" title="求人作成サポート">
                    <Menu.Item
                        key="recruitment-data-extraction"
                        className="secondary-menu-item"
                        icon={<FormOutlined />}
                        onClick={() => {
                            navigate("recruitment-data-extraction");
                        }}
                    >
                        データ抽出
                    </Menu.Item>
                    <Menu.Item
                        key="recruitment-data-list"
                        className="secondary-menu-item"
                        icon={<UnorderedListOutlined />}
                        onClick={() => {
                            navigate("recruitment-data-list");
                        }}
                    >
                        データ履歴
                    </Menu.Item>
                    <Menu.Item
                        key="recruitment-data-add"
                        className="secondary-menu-item"
                        icon={<PlusSquareOutlined />}
                        onClick={() => {
                            navigate("/recruitment-data-add");
                        }}
                    >
                        データ追加
                    </Menu.Item>
                    <Menu.Item key="recruitment-list" className="secondary-menu-item" icon={<UnorderedListOutlined />} onClick={() => { }}>
                        求人文章生成履歴
                    </Menu.Item>
                </SubMenu> */}
                <SubMenu className="primary-menu-item" key={MENU_TYPE.GPT} title="AIチャット">
                    <Menu.Item key={"new_gptcaht"}>
                        <Row justify="center">
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                onClick={() => {
                                    createChat(CHAT_TYPE.GPT);
                                }}
                            >
                                新規AIチャット
                            </Button>
                        </Row>
                    </Menu.Item>
                    {gptChatlist &&
                        gptChatlist.map(item => {
                            return (
                                <Menu.Item
                                    key={item.id}
                                    className="secondary-menu-item"
                                    icon={<CommentOutlined />}
                                    onClick={() => {
                                        navigate(CHAT_TYPE.GPT + "/" + item.id);
                                    }}
                                >
                                    <Row justify="start" align="middle">
                                        <Text
                                            style={{
                                                width: 110,
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                                color: selectedKeys.includes(item.id) ? "#1890ff" : "inherit"
                                            }}
                                        >
                                            {item.name}
                                        </Text>
                                        <Button
                                            type="link"
                                            icon={<EditTwoTone />}
                                            onClick={() => {
                                                openEditChatModal(item.id, CHAT_TYPE.GPT, item.name);
                                            }}
                                        />
                                        <Button
                                            type="link"
                                            icon={<DeleteTwoTone />}
                                            onClick={() => {
                                                deleteChat(item.id, item.type);
                                            }}
                                        />
                                    </Row>
                                </Menu.Item>
                            );
                        })}
                </SubMenu>
                <SubMenu className="primary-menu-item" key={MENU_TYPE.RETRIEVE} title="社内データ検索">
                    <Menu.Item key={"new_retrievecaht"}>
                        <Row justify="center">
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                onClick={() => {
                                    createChat(CHAT_TYPE.RETRIEVE);
                                }}
                            >
                                新規検索チャット
                            </Button>
                        </Row>
                    </Menu.Item>
                    {retrieveChatlist &&
                        retrieveChatlist.map(item => {
                            return (
                                <Menu.Item
                                    key={item.id}
                                    className="secondary-menu-item"
                                    icon={<CommentOutlined />}
                                    onClick={() => {
                                        navigate("retrieve/" + item.id);
                                    }}
                                >
                                    <Row justify="start" align="middle">
                                        <Text
                                            style={{
                                                width: 110,
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                                color: selectedKeys.includes(item.id) ? "#1890ff" : "inherit"
                                            }}
                                        >
                                            {item.name}
                                        </Text>
                                        <Button
                                            type="link"
                                            icon={<EditTwoTone />}
                                            onClick={() => {
                                                openEditChatModal(item.id, CHAT_TYPE.RETRIEVE, item.name);
                                            }}
                                        />
                                        <Button
                                            type="link"
                                            icon={<DeleteTwoTone />}
                                            onClick={() => {
                                                deleteChat(item.id, item.type);
                                            }}
                                        />
                                    </Row>
                                </Menu.Item>
                            );
                        })}
                </SubMenu>
                <SubMenu className="primary-menu-item" key={MENU_TYPE.FILEMANAGEMENT} title="データ管理">
                    <Menu.Item
                        className="secondary-menu-item"
                        key={"retrieve_file_upload"}
                        icon={<UploadOutlined />}
                        onClick={() => {
                            navigate("retrieve_file_upload");
                        }}
                    >
                        アップロード
                    </Menu.Item>
                    <Menu.Item
                        className="secondary-menu-item"
                        key={"retrieve_file_list"}
                        icon={<FileSearchOutlined />}
                        onClick={() => {
                            navigate("retrieve_file_list");
                        }}
                    >
                        ファイル一覧
                    </Menu.Item>
                </SubMenu>
                <SubMenu className="primary-menu-item" key={MENU_TYPE.USERINFO} title="ユーザー情報">
                    <Menu.Item
                        className="secondary-menu-item"
                        key={"login_history_list"}
                        onClick={() => {
                            navigate("login_history_list");
                        }}
                    >
                        ログイン履歴一覧
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Modal title="チャット名変更" open={openEdit} onOk={saveChatName} confirmLoading={confirmLoading} onCancel={cancelChatName}>
                <Input
                    value={currentChatName}
                    allowClear={true}
                    onChange={e => {
                        setCurrentChatName(e.target.value);
                    }}
                />
            </Modal>
        </div>
    );
};
export default MenuList;
