import { Divider } from 'antd';
import LogoImage from "../../assets/cr_logo.svg";

export const AnswerIcon = () => {
    return (
        <>
            <img style={{ height: 20 }} src={LogoImage} alt="justcareer_logo" />
            <Divider style={{ margin: '5px 0', width: '100%' }} />
        </>
    )
};