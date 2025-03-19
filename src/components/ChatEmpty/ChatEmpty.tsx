import styles from "./ChatEmpty.module.css";
import LogoImage from "../../assets/cr_logo.svg";

export const ChatEmpty = () => {
    return (
        <div className={styles.chatEmptyState}>
            <img style={{ height: 64, paddingBottom: 10, marginTop: 150 }} src={LogoImage} alt="justcareer_logo" />
            <h2 className={styles.chatEmptyStateTitle}>プライベートAIチャット</h2>
            <h2 className={styles.chatEmptyStateSubtitle}>お客様の企業データをもとに、的確な回答を提供いたします。</h2>
        </div>
    );
};
