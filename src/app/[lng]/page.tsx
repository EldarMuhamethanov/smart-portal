import styles from "./page.module.css";
import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { ContractInterfacePage } from "@/app/client/contract-interface/view/ContractInterfacePage";
import { PageHeader } from "@/app/client/contract-interface/view/header/PageHeader";

export default async function Page({
  params: { lng },
}: {
  params: { lng: string };
}) {
  return (
    <div className={styles.page}>
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <PageHeader lng={lng} />
        </Header>
        <Content className={styles.content}>
          <ContractInterfacePage params={{ lng }} />
        </Content>
      </Layout>
    </div>
  );
}
