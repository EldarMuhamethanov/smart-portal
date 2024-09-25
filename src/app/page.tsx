import styles from "./page.module.css";
import { Layout, Image } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { ContractInterfacePage } from "@/contract-interface/view/ContractInterfacePage";

export default function Home() {
  return (
    <div className={styles.page}>
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <Image />
        </Header>
        <Content className={styles.content}>
          <ContractInterfacePage />
        </Content>
      </Layout>
    </div>
  );
}
