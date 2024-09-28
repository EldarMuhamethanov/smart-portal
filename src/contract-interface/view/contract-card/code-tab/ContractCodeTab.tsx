import { appSettings } from "@/contract-interface/model/AppModel";
import { ContractCardModel } from "@/contract-interface/model/ContractCard/ContractCardModel";
import { Editor } from "@monaco-editor/react";
import { Flex, Typography } from "antd";
import { observer } from "mobx-react-lite";

export const ContractCodeTab: React.FC<{ contractModel: ContractCardModel }> =
  observer(({ contractModel }) => {
    return (
      <Flex vertical>
        {!contractModel.verified && (
          <Typography.Paragraph>
            К сожалению мы не можем отобразить исходный код смарт контракта так
            как данный смарт-контракт не верифицирован. Но вы можете
            воспользоваться конструктором создание кастомных запросов к данному
            смарт контракту на вкладке &quot;Методы&quot;
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
