import { ABI } from "@/web3/abi/ABI";
import { Button, Flex, Input, Select, SelectProps, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { ContractCardModel } from "../../../model/ContractCard/ContractCardModel";
import { useEffect, useMemo, useState } from "react";
import {
  FilterData,
  FilterFieldData,
} from "../../../model/ContractCard/ContractEventsModel";
import { useTranslationContext } from "../../TranslationContext";

type ViewEventData = {
  name: string;
  indexedFields: Array<{
    type: string;
    name: string;
  }>;
};

const parseEventsFromAbi = (abi: ABI): ViewEventData[] => {
  return abi.reduce((res, item) => {
    if (item.type === "event") {
      res.push({
        name: item.name,
        indexedFields: item.inputs.reduce(
          (fieldsRes, input) => {
            if (input.indexed) {
              fieldsRes.push({
                type: input.type,
                name: input.name,
              });
            }
            return fieldsRes;
          },
          [] as Array<{
            type: string;
            name: string;
          }>
        ),
      });
    }
    return res;
  }, [] as ViewEventData[]);
};

const parseFieldToValue = (
  filterData: FilterData | null
): Record<string, string> => {
  return (
    filterData?.fields.reduce((res, field) => {
      res[field.name] = field.values.join(",");
      return res;
    }, {} as Record<string, string>) || {}
  );
};

const remapArgsValues = (
  fields: Array<{ type: string; name: string; value: string }>
): FilterFieldData[] => {
  return fields.map((field) => {
    const { value, type, name } = field;
    const values = value ? value.split(/,\s*/) : [];

    return {
      name,
      values: values.map((item) => {
        if (type === "bool") {
          return JSON.parse(item);
        }
        if (type.endsWith("]") || type === "tuple") {
          return JSON.parse(item);
        }
        if (type.startsWith("uint") && !type.endsWith("]")) {
          return Number(item);
        }
        return item;
      }),
    };
  });
};

export const EventsFilterBlock: React.FC<{ contractModel: ContractCardModel }> =
  observer(({ contractModel }) => {
    const [selectedEvent, setSelectedEvent] = useState<string | null>(
      contractModel.eventsFilter?.eventName || null
    );
    const [fieldToValue, setFieldToValue] = useState<Record<string, string>>(
      parseFieldToValue(contractModel.eventsFilter)
    );
    const abi = contractModel.abi;
    if (!abi) {
      return null;
    }

    const _updateFieldValue = (field: string, value: string) => {
      setFieldToValue((v) => ({
        ...v,
        [field]: value,
      }));
    };

    useEffect(() => {
      if (!contractModel.eventsFilter) {
        setSelectedEvent(null);
        setFieldToValue({});
      } else {
        setSelectedEvent(contractModel.eventsFilter.eventName);
        setFieldToValue(parseFieldToValue(contractModel.eventsFilter));
      }
    }, [contractModel.eventsFilter]);

    const eventsData: ViewEventData[] = useMemo(
      () => parseEventsFromAbi(abi),
      [abi]
    );

    const selectedEventFields = useMemo(() => {
      return (
        eventsData.find((event) => event.name === selectedEvent)
          ?.indexedFields || null
      );
    }, [eventsData, selectedEvent]);

    const filtersChanged = useMemo(() => {
      const appliedEventName = contractModel.eventsFilter?.eventName || null;
      const parsedFieldToValue = parseFieldToValue(contractModel.eventsFilter);

      return (
        appliedEventName !== selectedEvent ||
        selectedEventFields?.some((field) => {
          return (
            (fieldToValue[field.name] || null) !==
            (parsedFieldToValue[field.name] || null)
          );
        })
      );
    }, [
      contractModel.eventsFilter,
      fieldToValue,
      selectedEvent,
      selectedEventFields,
    ]);

    const onEventNameChanged: SelectProps["onChange"] = (value) => {
      setSelectedEvent(value);
    };

    const onSubmitFilter = () => {
      if (selectedEvent) {
        const remappedData = remapArgsValues(
          (selectedEventFields || []).map((field) => {
            return {
              name: field.name,
              type: field.type,
              value: fieldToValue[field.name],
            };
          })
        );
        contractModel.setFilterData({
          eventName: selectedEvent,
          fields: remappedData.filter((field) => !!field.values.length),
        });
      } else {
        contractModel.setFilterData(null);
      }
    };

    const onClearFilter = () => {
      setSelectedEvent(null);
      setFieldToValue({});
      contractModel.setFilterData(null);
    };

    const { t } = useTranslationContext();

    return (
      <Flex
        vertical
        align="flex-start"
        gap={20}
        style={{
          top: -50,
          position: "sticky",
          zIndex: 2,
          background: "inherit",
          paddingBlock: 10,
        }}
      >
        <Flex gap={20}>
          <Select
            placeholder={t("events.select-event")}
            onChange={onEventNameChanged}
            value={selectedEvent}
            allowClear
            onClear={onClearFilter}
          >
            {eventsData.map((event) => (
              <Select.Option key={event.name} value={event.name}>
                {event.name}
              </Select.Option>
            ))}
          </Select>
          {selectedEvent && (
            <Button onClick={onClearFilter}>{t("events.reset")}</Button>
          )}
        </Flex>
        {selectedEventFields?.length && (
          <Flex gap={20}>
            {selectedEventFields.map((field) => (
              <Flex vertical key={field.name}>
                <Typography.Title level={5}>{field.name}</Typography.Title>
                <Input
                  placeholder={field.type}
                  onChange={(e) =>
                    _updateFieldValue(field.name, e.target.value)
                  }
                />
              </Flex>
            ))}
          </Flex>
        )}
        {filtersChanged && (
          <Flex gap={20}>
            <Button type="primary" onClick={onSubmitFilter}>
              {t("events.apply-filter")}
            </Button>
          </Flex>
        )}
      </Flex>
    );
  });
