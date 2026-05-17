import React, { useState } from "react";
import { useDql } from "@dynatrace-sdk/react-hooks";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Paragraph } from "@dynatrace/strato-components/typography";
import { Select, Label } from "@dynatrace/strato-components/forms";
import { Button } from "@dynatrace/strato-components/buttons";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import {
  FRONTEND_DEFAULT,
  useFrontendSetting,
} from "../settings/frontendSetting";

interface FrontendRow extends Record<string, unknown> {
  name: string;
}

const FRONTEND_QUERY = `
fetch user.events, from: now() - 30d
| filter characteristics.has_navigation == true
| filter dt.rum.user_type != "robot"
| summarize cnt = count(), by: { name = frontend.name }
| filter isNotNull(name) and name != ""
| sort cnt desc
| limit 100
`.trim();

export const Settings = () => {
  const [stored, setStored] = useFrontendSetting();
  const [draft, setDraft] = useState<string>(stored);
  const [savedTick, setSavedTick] = useState(0);

  const { data, isLoading } = useDql<FrontendRow>({ query: FRONTEND_QUERY });
  const frontendNames: string[] = (data?.records as FrontendRow[] | undefined)
    ?.map((r) => String(r.name))
    .filter((n) => n.length > 0) ?? [];

  // Ensure current stored value is in the list for display
  const options = frontendNames.includes(draft)
    ? frontendNames
    : [draft, ...frontendNames];

  const onSave = () => {
    setStored(draft);
    setSavedTick((t) => t + 1);
  };

  const onReset = () => {
    setDraft(FRONTEND_DEFAULT);
    setStored(FRONTEND_DEFAULT);
    setSavedTick((t) => t + 1);
  };

  return (
    <Flex flexDirection="column" padding={32} gap={16} style={{ maxWidth: 720 }}>
      <Heading level={2}>Hyperlyzer settings</Heading>
      <Paragraph>
        Choose which RUM application (frontend) Hyperlyzer should analyze. The
        value is matched against the <code>frontend.name</code> field of
        <code> user.events</code>.
      </Paragraph>

      <Flex flexDirection="column" gap={4}>
        <Label>Application (frontend.name)</Label>
        {isLoading ? (
          <Flex gap={8} alignItems="center">
            <ProgressCircle size="small" />
            <Paragraph>Loading available applications...</Paragraph>
          </Flex>
        ) : (
          <Select
            name="frontend-select"
            value={draft}
            onChange={(v) => { if (v) setDraft(v); }}
          >
            <Select.Content>
              {options.map((name) => (
                <Select.Option key={name} value={name}>
                  {name}
                </Select.Option>
              ))}
            </Select.Content>
          </Select>
        )}
        <Paragraph>
          Default: <code>{FRONTEND_DEFAULT}</code>
        </Paragraph>
      </Flex>

      <Flex gap={8}>
        <Button variant="accent" color="primary" onClick={onSave}>
          Save
        </Button>
        <Button variant="default" onClick={onReset}>
          Reset to default
        </Button>
        {savedTick > 0 && <Paragraph>Saved.</Paragraph>}
      </Flex>
    </Flex>
  );
};
