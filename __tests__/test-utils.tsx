import { MantineProvider, createTheme, Modal, Combobox } from "@mantine/core";
import { render as testingLibraryRender } from "@testing-library/react";
import { ModalsProvider } from "@mantine/modals";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const testTheme = createTheme({
  components: {
    Modal: Modal.extend({
      defaultProps: {
        transitionProps: { duration: 0 },
        withinPortal: false,
      },
    }),
    Combobox: Combobox.extend({
      defaultProps: {
        transitionProps: { duration: 0 },
        withinPortal: false,
      },
    }),
  },
});

function TestProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={testTheme}>
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}

export function render(ui: React.ReactElement) {
  return testingLibraryRender(ui, {
    wrapper: TestProviders,
  });
}

export async function selectOption(name: string, optionName: string) {
  const input = screen.getByRole("textbox", { name });
  await userEvent.click(input);
  await userEvent.click(screen.getByRole("option", { name: optionName }));
}

export * from "@testing-library/react";
