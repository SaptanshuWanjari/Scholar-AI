import React, { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PaperButton, PaperInput, Stack, Paper, Fade, Flex, Box } from "@paper-ui/components";
import { mergeRefs, Keys, isShortcut, paperTransitions } from "@paper-ui/utils";

const meta: Meta = {
  title: "Utilities/Helpers",
  parameters: { layout: "centered" },
};

export default meta;

const Bg = ({ children }: { children: React.ReactNode }) => (
  <div className="p-8 bg-[#f4f1ea]">{children}</div>
);

export const RefHelpers: StoryObj = {
  render: () => {
    const localRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");
    const externalRef = useRef<HTMLInputElement>(null);
    const merged = mergeRefs(localRef, externalRef);
    return (
      <Bg>
        <Paper className="p-6 max-w-sm">
          <Stack spacing="md">
            <h3 className="font-architect font-bold text-sm">mergeRefs</h3>
            <PaperInput ref={merged} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Merged ref" />
            <Flex gap="sm" wrap="wrap">
              <PaperButton onClick={() => localRef.current?.focus()} size="sm">Local</PaperButton>
              <PaperButton onClick={() => externalRef.current?.focus()} size="sm">External</PaperButton>
            </Flex>
          </Stack>
        </Paper>
      </Bg>
    );
  }
};

export const KeyboardHelpers: StoryObj = {
  render: () => {
    const [logs, setLogs] = useState<string[]>([]);
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isShortcut(e, Keys.Enter)) setLogs(p => [...p.slice(-3), "Enter"]);
      else if (isShortcut(e, Keys.Escape)) setLogs(p => [...p.slice(-3), "Esc"]);
    };
    return (
      <Bg>
        <Paper className="p-6 max-w-sm">
          <Stack spacing="md">
            <h3 className="font-architect font-bold text-sm">Keyboard</h3>
            <PaperInput onKeyDown={handleKeyDown} placeholder="Press Enter or Esc" />
            <Box className="p-2 bg-gray-50 rounded text-xs font-mono min-h-8 overflow-y-auto">
              {logs.length === 0 ? <span className="text-gray-400">No keys</span> : logs.map((l, i) => <div key={i}>{l}</div>)}
            </Box>
          </Stack>
        </Paper>
      </Bg>
    );
  }
};

export const AnimationHelpers: StoryObj = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <Bg>
        <Paper className="p-6 max-w-sm">
          <Stack spacing="md">
            <h3 className="font-architect font-bold text-sm">Animation</h3>
            <PaperButton onClick={() => setVisible(!visible)}>Toggle</PaperButton>
            <div className="h-24 flex items-center justify-center">
              <Fade in={visible} duration={paperTransitions.ease.duration * 1000}>
                <Paper className="p-4">Fading box</Paper>
              </Fade>
            </div>
          </Stack>
        </Paper>
      </Bg>
    );
  }
};
