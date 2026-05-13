import React, { useState } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Paragraph } from "@dynatrace/strato-components/typography";
import { TextInput, Label } from "@dynatrace/strato-components/forms";
import { Button } from "@dynatrace/strato-components/buttons";
import {
  FRONTEND_DEFAULT,
  useFrontendSetting,
} from "../settings/frontendSetting";

export const Settings = () => {
  const [stored, setStored] = useFrontendSetting();
  const [draft, setDraft] = useState<string>(stored);
  const [savedTick, setSavedTick] = useState(0);

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
        <TextInput
          value={draft}
          onChange={(v: string) => setDraft(v)}
          placeholder={FRONTEND_DEFAULT}
        />
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
