import { ContractInterface } from "./ContractInterface";
import styles from "./ContractInterfacePage.module.css";
import Title from "antd/lib/typography/Title";

export const ContractInterfacePage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Title>
          SmartPortal - ваш универсальный инструмент для взаимодействия со
          смарт-контрактами
        </Title>
        <Title level={3}>
          SmartPortal - это инновационный веб-сервис, который позволяет легко и
          удобно подключаться к смарт-контрактам в различных блокчейн-сетях. Наш
          сервис предоставляет простой и интуитивно понятный интерфейс для
          работы с контрактами, похожий на популярный онлайн-редактор Remix.
        </Title>
        <ContractInterface />
      </div>
    </div>
  );
};
