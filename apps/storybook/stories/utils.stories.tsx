import React, { useRef, useState } from "react";
import type { Meta } from "@storybook/react";
import {
  PaperButton,
  PaperInput,
  Stack,
  Box,
  Paper,
  Fade,
  Flex,
} from "@paper-ui/components";
import { PaperH2, PaperH3, PaperPanel } from "@paper-ui/core";
import {
  mergeRefs,
  Keys,
  isShortcut,
  paperTransitions,
  paperVariants,
} from "@paper-ui/utils";

const meta: Meta = {
  title: "Utilities/Helpers",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `## Utility Helpers

General-purpose utility functions and constants exported from \`@paper-ui/utils\`.

### Exports
- **mergeRefs** / **composeRefs** — combine multiple refs into a single callback ref
- **Keys** — named keyboard key constants
- **isShortcut** — declarative keyboard shortcut matcher
- **paperTransitions** — standard Framer Motion / CSS transition configs
- **paperVariants** — standard animation variant objects`,
      },
    },
  },
};
export default meta;

export const RefHelpers = () => {
  const localRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("Type here...");
  
  // A mock external ref that a parent might pass down
  const externalRef = useRef<HTMLInputElement>(null);

  // We merge them here. In a real component, this would be inside a forwardRef.
  const merged = mergeRefs(localRef, externalRef);

  const focusLocal = () => {
    localRef.current?.focus();
  };

  const focusExternal = () => {
    externalRef.current?.focus();
  };

  return (
    <Box className="w-[500px]">
      <Paper elevation={1} className="p-6">
        <Stack spacing="lg">
          <PaperH2>mergeRefs / composeRefs</PaperH2>
          <Box className="text-sm text-ink-muted mb-4">
            Combines multiple refs into a single callback ref.
          </Box>
          <PaperInput
            ref={merged}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Focus me with buttons below"
          />
          <Flex gap="md" wrap="wrap">
            <PaperButton onClick={focusLocal}>Focus via Local Ref</PaperButton>
            <PaperButton onClick={focusExternal} tone="dark">
              Focus via External Ref
            </PaperButton>
          </Flex>
        </Stack>
      </Paper>
    </Box>
  );
};

export const KeyboardHelpers = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isShortcut(e, Keys.Enter)) {
      setLogs((prev) => [...prev, "Enter pressed!"]);
    } else if (isShortcut(e, "k", { meta: true })) {
      e.preventDefault();
      setLogs((prev) => [...prev, "Cmd/Ctrl + K pressed!"]);
    } else if (isShortcut(e, Keys.Escape)) {
      setLogs((prev) => [...prev, "Escape pressed!"]);
    }
  };

  return (
    <Box className="w-[500px]">
      <Paper elevation={1} className="p-6">
        <Stack spacing="lg">
          <PaperH2>Keyboard Helpers</PaperH2>
          <Box className="text-sm text-ink-muted mb-4">
            Use `Keys` and `isShortcut` to easily handle keyboard events.
            Try pressing Enter, Escape, or Cmd/Ctrl + K inside the input.
          </Box>
          <PaperInput
            onKeyDown={handleKeyDown}
            placeholder="Type shortcuts here..."
          />
          <PaperPanel surface="#fbfbfb" className="mt-4 p-4 min-h-[100px] font-mono text-sm overflow-y-auto max-h-[200px]">
            {logs.length === 0 ? "No shortcuts detected yet." : logs.map((log, i) => (
              <Box key={i}>{log}</Box>
            ))}
          </PaperPanel>
          <Flex justify="start">
            <PaperButton onClick={() => setLogs([])} tone="paper" size="sm">
              Clear Logs
            </PaperButton>
          </Flex>
        </Stack>
      </Paper>
    </Box>
  );
};

export const AnimationHelpers = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Box className="w-[550px]">
      <Paper elevation={1} className="p-6">
        <Stack spacing="lg">
          <PaperH2>Animation Config</PaperH2>
          <Box className="text-sm text-ink-muted mb-4">
            Standard `paperTransitions` and `paperVariants` exported for Framer Motion or CSS transitions.
          </Box>
          <Flex>
            <PaperButton onClick={() => setIsVisible(!isVisible)}>
              Toggle Visibility
            </PaperButton>
          </Flex>

          <PaperPanel className="h-[200px] relative flex items-center justify-center p-4">
            <Fade in={isVisible} duration={paperTransitions.ease.duration * 1000}>
              <Paper className="p-4" elevation={2}>
                <PaperH3>Fading Paper</PaperH3>
              </Paper>
            </Fade>
          </PaperPanel>

          <Paper surface="#262320" className="text-xs text-[#fbf8f2] p-4" border={{ stroke: "#262320" }}>
            <pre className="font-mono m-0 leading-relaxed bg-transparent overflow-auto max-h-[250px]">
              {JSON.stringify({ paperTransitions, paperVariants }, null, 2)}
            </pre>
          </Paper>
        </Stack>
      </Paper>
    </Box>
  );
};
