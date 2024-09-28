import styles from "./page.module.css";
import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { ContractInterfacePage } from "@/contract-interface/view/ContractInterfacePage";
import { PageHeader } from "@/contract-interface/view/header/PageHeader";

export default function Home() {
  return (
    <div className={styles.page}>
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <PageHeader />
        </Header>
        <Content className={styles.content}>
          <ContractInterfacePage />
        </Content>
      </Layout>
    </div>
  );
}
