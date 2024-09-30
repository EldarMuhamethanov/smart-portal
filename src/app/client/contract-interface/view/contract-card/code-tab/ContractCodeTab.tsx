import { appSettings } from "@/app/client/contract-interface/model/AppModel";
import { ContractCardModel } from "@/app/client/contract-interface/model/ContractCard/ContractCardModel";
import { Editor } from "@monaco-editor/react";
import { Flex, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslationContext } from "../../TranslationContext";

export const ContractCodeTab: React.FC<{ contractModel: ContractCardModel }> =
  observer(({ contractModel }) => {
    const { t } = useTranslationContext();
    return (
      <Flex vertical>
        {!contractModel.verified && (
          <Typography.Paragraph>
            {t("contract-card.code.not-verified")}
          </Typography.Paragraph>
        )}
        {contractModel.verified && (
          <Editor
            height="500px"
            defaultLanguage="sol"
            theme={appSettings.darkModeOn ? "vs-dark" : "vs-light"}
            value={contractModel.code}
            options={{
              readOnly: true,
              scrollBeyondLastLine: false,
            }}
          />
        )}
      </Flex>
    );
  });
