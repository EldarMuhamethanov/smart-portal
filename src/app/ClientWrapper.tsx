"use client";

import { Button, Form, Input } from "antd";
import { MethodForm } from "../contract-interface/view/contract-card/method-form/MethodForm";
import { connectToMetaMask } from "@/connectToMetamask";
import { useState } from "react";
import Web3 from "web3";
import { getWeb3ByType } from "@/web3/providers";

async function getABI(contractAddress: string) {
  const apiKey = "DDZPITBAMCT4SV1CNBW91GX3TQZXSN62AQ";
  const url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;

  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();
    const abi = JSON.parse(data.result);
    console.log("abi", abi);
  } catch (error) {
    console.error("Error fetching ABI:", error);
  }
}

export const ClientWrapper = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);

  const onButtonClick = async () => {
    setWeb3(getWeb3ByType("sepolia"));
  };

  const onContractNumberFinish = async (values) => {
    const value = await web3?.eth.getStorageAt(values.contract, 0);
    const abi = await getABI(values.contract);
  };

  return (
    <div style={{ width: 800 }}>
      <Button onClick={onButtonClick}>Подключиться к Metamask</Button>

      <Form
        name="contract-id"
        layout="inline"
        onFinish={onContractNumberFinish}
      >
        <Form.Item
          name="contract"
          rules={[
            { required: true, message: "Нужно ввести адрес смар-контракта" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Подтвердить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
