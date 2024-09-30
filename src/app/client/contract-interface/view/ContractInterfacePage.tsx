import { ContractInterface } from "./ContractInterface";
import styles from "./ContractInterfacePage.module.css";
import Title from "antd/lib/typography/Title";
import { useTranslation } from "../../../i18n";

export const ContractInterfacePage = async ({
  params: { lng },
}: {
  params: { lng: string };
}) => {
  const { t } = await useTranslation(lng);
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Title className={styles.title}>{t("site-title")}</Title>
        {/* <Title level={3}>
          SmartPortal - это инновационный веб-сервис, который позволяет легко и
          удобно подключаться к смарт-контрактам в различных блокчейн-сетях. Наш
          сервис предоставляет простой и интуитивно понятный интерфейс для
          работы с контрактами, похожий на популярный онлайн-редактор Remix.
        </Title> */}
        <ContractInterface lng={lng} />
      </div>
    </div>
  );
};
