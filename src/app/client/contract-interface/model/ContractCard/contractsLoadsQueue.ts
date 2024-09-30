import { ContractCardModel } from "./ContractCardModel";

const queue: [string, () => Promise<void>][] = [];

export const addContractLoadToQueue = (
  address: string,
  contractModel: ContractCardModel
) => {
  if (!queue.find((item) => item[0] === address)) {
    queue.push([address, () => contractModel.loadMethods()]);

    if (queue.length === 1) {
      doFirstActionFromQueue();
    }
  }
};

const doFirstActionFromQueue = () => {
  if (queue.length > 0) {
    queue[0][1]().then(() => {
      queue.shift();
      doFirstActionFromQueue();
    });
  }
};
