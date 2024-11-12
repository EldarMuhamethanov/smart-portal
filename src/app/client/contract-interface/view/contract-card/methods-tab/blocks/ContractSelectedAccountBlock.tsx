import {
  accountsModel,
  environmentModel,
} from "@/app/client/contract-interface/model/AppModel";
import { ContractCardModel } from "@/app/client/contract-interface/model/ContractCard/ContractCardModel";
import { Typography, Select, SelectProps, Flex, Button } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslationContext } from "../../../TranslationContext";
import { CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/core/clipboard";

export const ContractSelectedAccountBlock: React.FC<{
  contractModel: ContractCardModel;
}> = observer(({ contractModel }) => {
  const { t } = useTranslationContext();
  const onChangeAccount: SelectProps["onChange"] = (value) => {
    contractModel.setSelectedAccount(value);
  };

  const calculateAccountBalance = () => {
    if (typeof contractModel.selectedAccount?.balance === "string" && environmentModel.web3) {
      const balanceInEth = environmentModel.web3.utils.fromWei(
        contractModel.selectedAccount.balance,
        "ether"
      );

      const dotPos = balanceInEth.indexOf(".");
      if (dotPos === -1) {
        return balanceInEth;
      }
      return (
        balanceInEth.slice(0, dotPos) +
        "." +
        balanceInEth.slice(dotPos + 1, dotPos + 5)
      );
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
            <Flex gap={10} justify="space-between" align="center">
              <Typography.Text ellipsis>
                {calculateAccountLabel(account)}
              </Typography.Text>
              <Button
                size="small"
                style={{ flexShrink: 0 }}
                icon={<CopyOutlined />}
                onPointerDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(account);
                }}
              />
            </Flex>
          </Select.Option>
        ))}
      </Select>
    </Flex>
  );
});
