import { observer } from "mobx-react-lite";
import { ContractCardModel } from "../../../model/ContractCard/ContractCardModel";
import { Spin, Flex, Card, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { lazy } from "react";
import { appSettings } from "../../../model/AppModel";
import { useSingleLayoutEffect } from "@/core/hooks/useSingleLayoutEffect";
import { EventsFilterBlock } from "./EventsFilterBlock";

const LazyReactJson = lazy(() => import("react-json-view"));

export const ContractEventsTab: React.FC<{ contractModel: ContractCardModel }> =
  observer(({ contractModel }) => {
    useSingleLayoutEffect(() => {
      contractModel.loadEvents();
    });

    return (
      <Flex
        vertical
        gap={20}
        style={{
          background: "inherit",
        }}
      >
        {contractModel.abi && (
          <EventsFilterBlock contractModel={contractModel} />
        )}
        {!contractModel.abi && (
          <Typography.Paragraph>
            Данный контракт неверифицирован, поэтому мы не можем отобразить
            события
          </Typography.Paragraph>
        )}
        {contractModel.eventsLoading && (
          <Spin indicator={<LoadingOutlined spin />} />
        )}
        {!contractModel.eventsLoading && (
          <>
            {!contractModel.events.length && (
              <Typography.Paragraph>
                У данного контракта не было вызвано ни одного события
              </Typography.Paragraph>
            )}
            {contractModel.events.map((event, index) => (
              <Card
                title={
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    {event.name}
                  </Typography.Title>
                }
                key={`${event.name}_${index}`}
                type="inner"
              >
                <LazyReactJson
                  src={event.values}
                  style={{ maxWidth: "100%", overflow: "auto" }}
                  theme={appSettings.darkModeOn ? "twilight" : undefined}
                />
                <Typography.Title level={5}>Полная информация</Typography.Title>
                <LazyReactJson
                  src={event.fullData}
                  style={{ maxWidth: "100%", overflow: "auto" }}
                  theme={appSettings.darkModeOn ? "twilight" : undefined}
                  collapsed
                />
              </Card>
            ))}
          </>
        )}
      </Flex>
    );
  });
