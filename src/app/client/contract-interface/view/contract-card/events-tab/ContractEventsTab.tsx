import { observer } from "mobx-react-lite";
import { ContractCardModel } from "../../../model/ContractCard/ContractCardModel";
import { Flex } from "antd";
import { useEffect } from "react";

export const ContractEventsTab: React.FC<{ contractModel: ContractCardModel }> =
  observer(({ contractModel }) => {
    useEffect(() => {
      contractModel.loadEvents();
    }, [contractModel]);

    return (
      <Flex>
        <div></div>
      </Flex>
    );
  });
