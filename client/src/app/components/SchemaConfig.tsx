import { useRef, useState } from "react";
import {
  AttributeEditor,
  Input,
  SplitPanel,
  SplitPanelProps,
} from "@cloudscape-design/components";

const splitPanelI18nStrings: SplitPanelProps.I18nStrings = {
  preferencesTitle: "Split panel preferences",
  preferencesPositionLabel: "Split panel position",
  preferencesPositionDescription:
    "Choose the default split panel position for the service.",
  preferencesPositionSide: "Side",
  preferencesPositionBottom: "Bottom",
  preferencesConfirm: "Confirm",
  preferencesCancel: "Cancel",
  closeButtonAriaLabel: "Close panel",
  openButtonAriaLabel: "Open panel",
  resizeHandleAriaLabel: "Resize split panel",
};

export default function SchemaConfig() {
  const [items, setItems] = useState([
    { key: "some-key-1", value: "some-value-1" },
    { key: "some-key-2", value: "some-value-2" },
  ]);
  return (
    <SplitPanel
      header="Schema configuration"
      i18nStrings={splitPanelI18nStrings}
    >
      <AttributeEditor
        onAddButtonClick={() => setItems([...items, { key: "", value: "" }])}
        onRemoveButtonClick={({ detail: { itemIndex } }) => {
          const tmpItems = [...items];
          tmpItems.splice(itemIndex, 1);
          setItems(tmpItems);
        }}
        items={items}
        addButtonText="Add column"
        removeButtonText="Remove"
        definition={[
          {
            label: "Column",
            control: (item) => (
              <Input value={item.key} placeholder="Enter key" />
            ),
          },
          {
            label: "Type",
            control: (item) => (
              <Input value={item.value} placeholder="Enter value" />
            ),
          },
        ]}
        empty="No items associated with the resource."
      />
    </SplitPanel>
  );
}
