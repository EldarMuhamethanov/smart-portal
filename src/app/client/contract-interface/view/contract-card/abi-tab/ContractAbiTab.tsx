import { observer } from "mobx-react-lite";
import { ContractCardModel } from "../../../model/ContractCard/ContractCardModel";
import { Button, Flex, Input, Typography } from "antd";
import { Editor } from "@monaco-editor/react";
import { appSettings } from "../../../model/AppModel";
import { useEffect, useState } from "react";
import { isValidContractABI } from "../../../model/ContractCard/helpers/validateAbi";
import { ABI } from "@/web3/ABI";

const NotVerifiedContractAbiContent: React.FC<{
  contractModel: ContractCardModel;
}> = observer(({ contractModel }) => {
  const [abiShowMode, setAbiShowMode] = useState<
    "none" | "add" | "edit" | "readonly"
  >(contractModel.abi ? "readonly" : "none");
  const [editorValue, setEditorValue] = useState(
    contractModel.abi
      ? JSON.stringify(contractModel.abi, null, 2)
      : "// Добавьте ABI этого контракта"
  );
  const [incorrectFormatError, setIncorrectFormatError] = useState(false);

  useEffect(() => {
    setAbiShowMode(contractModel.abi ? "readonly" : "none");
  }, [contractModel.abi]);

  return (
    <Flex vertical gap={20} align="flex-start">
      {!contractModel.abi && (
        <Typography.Paragraph>
          Данный контракт неверифицирован, поэтому мы не можем отобразить ABI
        </Typography.Paragraph>
      )}
      {!contractModel.abi && abiShowMode !== "add" && (
        <Button type="primary" onClick={() => setAbiShowMode("add")}>
          Добавить ABI
        </Button>
      )}
      {abiShowMode === "readonly" && (
        <Typography.Title level={3}>Вручную добавленный ABI</Typography.Title>
      )}
      {abiShowMode !== "none" && (
        <Editor
          height="500px"
          defaultLanguage="json"
          theme={appSettings.darkModeOn ? "vs-dark" : "vs-light"}
          onChange={(newValue) => {
            setIncorrectFormatError(false);
            if (newValue !== undefined) {
              setEditorValue(newValue);
            }
          }}
          value={editorValue}
          options={{
            readOnly: abiShowMode === "readonly",
            scrollBeyondLastLine: false,
          }}
        />
      )}
      {incorrectFormatError && (
        <Input
          readOnly
          status="error"
          variant="filled"
          value={"Некорректный формат ABI"}
        />
      )}
      {abiShowMode === "readonly" && (
        <Button onClick={() => setAbiShowMode("edit")}>Изменить ABI</Button>
      )}
      {(abiShowMode === "edit" || abiShowMode === "add") && (
        <Button
          type="primary"
          onClick={() => {
            const isValidAbi = isValidContractABI(editorValue);
            if (isValidAbi) {
              contractModel.setAbi(JSON.parse(editorValue) as ABI);
            } else {
              setIncorrectFormatError(true);
            }
          }}
        >
          Применить ABI
        </Button>
      )}
    </Flex>
  );
});

const VerifiedContractAbiContent: React.FC<{
  contractModel: ContractCardModel;
}> = observer(({ contractModel }) => {
  return (
    <Flex vertical gap={20}>
      <Editor
        height="500px"
        defaultLanguage="json"
        theme={appSettings.darkModeOn ? "vs-dark" : "vs-light"}
        value={JSON.stringify(contractModel.abi, null, 2)}
        options={{
          readOnly: true,
          scrollBeyondLastLine: false,
        }}
      />
    </Flex>
  );
});

export const ContractAbiTab: React.FC<{ contractModel: ContractCardModel }> =
  observer(({ contractModel }) => {
    return (
      <Flex vertical gap={20}>
        {contractModel.verified && (
          <VerifiedContractAbiContent contractModel={contractModel} />
        )}
        {!contractModel.verified && (
          <NotVerifiedContractAbiContent contractModel={contractModel} />
        )}
      </Flex>
    );
  });
