import {
  accountsModel,
  environmentModel,
} from "@/contract-interface/model/AppModel";
import { ContractCardModel } from "@/contract-interface/model/ContractCard/ContractCardModel";
import { Typography, Select, SelectProps, Flex } from "antd";
import { observer } from "mobx-react-lite";

export const ContractSelectedAccountBlock: React.FC<{
  contractModel: ContractCardModel;
}> = observer(({ contractModel }) => {
  const onChangeAccount: SelectProps["onChange"] = (value) => {
    contractModel.setSelectedAccount(value);
  };

  const calculateAccountLabel = (account: string) => {
    if (
      account === contractModel.selectedAccount?.address &&
      contractModel.selectedAccount.balance
    ) {
      const balanceInEth = environmentModel.web3!.utils.fromWei(
        contractModel.selectedAccount.balance,
        "ether"
      );

      return `${account} (${balanceInEth} ETH)`;
    }
    return account;
  };

  return (
    <Flex vertical>
      <Typography.Title level={4}>Аккаунт</Typography.Title>
      <Select
        placeholder="Выберите пользователя"
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
