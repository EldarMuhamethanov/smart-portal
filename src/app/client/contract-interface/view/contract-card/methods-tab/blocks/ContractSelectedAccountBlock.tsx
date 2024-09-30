import {
  accountsModel,
  environmentModel,
} from "@/app/client/contract-interface/model/AppModel";
import { ContractCardModel } from "@/app/client/contract-interface/model/ContractCard/ContractCardModel";
import { Typography, Select, SelectProps, Flex } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslationContext } from "../../../TranslationContext";

export const ContractSelectedAccountBlock: React.FC<{
  contractModel: ContractCardModel;
}> = observer(({ contractModel }) => {
  const { t } = useTranslationContext();
  const onChangeAccount: SelectProps["onChange"] = (value) => {
    contractModel.setSelectedAccount(value);
  };

  const calculateAccountBalance = () => {
    if (typeof contractModel.selectedAccount?.balance === "string") {
      const balanceInEth = environmentModel.web3!.utils.fromWei(
        contractModel.selectedAccount.balance,
        "ether"
      );

      return balanceInEth;
    }
  };

  const calculateAccountLabel = (account: string) => {
    if (account === contractModel.selectedAccount?.address) {
      const balanceInEth = calculateAccountBalance();
      return `${account} (${balanceInEth} ETH)`;
    }
    return account;
  };

  return (
    <Flex vertical>
      <Flex align="center" gap={20} style={{ maxWidth: 600 }}>
        <Typography.Title level={4} style={{ flexGrow: 1 }}>
          {t("contract-card.methods.account-title")}
        </Typography.Title>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          {calculateAccountBalance()} ETH
        </Typography.Title>
      </Flex>
      <Select
        placeholder={t("contract-card.methods.select-account")}
        onChange={onChangeAccount}
        value={contractModel.selectedAccount?.address}
        style={{ maxWidth: 600 }}
      >
        {accountsModel.accounts.map((account) => (
          <Select.Option key={account} value={account}>
            {calculateAccountLabel(account)}
          </Select.Option>
        ))}
      </Select>
    </Flex>
  );
});
