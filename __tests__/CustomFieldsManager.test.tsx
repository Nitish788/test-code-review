import "@testing-library/jest-dom";
import { render, screen } from "./test-utils";
import userEvent from "@testing-library/user-event";
import { CustomFieldsManager } from "@/app/components/CustomFields/CustomFieldsManager.container";
import { CustomFieldType } from "@/app/shared/types/enums";

describe("CustomFieldsManager Component", () => {
  const mockOnAddField = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    opened: true,
    onClose: mockOnClose,
    customFields: [],
    onAddField: mockOnAddField,
    onRemoveField: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should prevent duplicate field names", async () => {
    const user = userEvent.setup();
    const existingFields = [
      { id: "1", name: "Score", type: CustomFieldType.NUMBER },
    ];

    render(
      <CustomFieldsManager {...defaultProps} customFields={existingFields} />
    );

    // Try adding duplicate field
    await user.type(screen.getByRole("textbox", { name: /name/i }), "Score");
    await user.selectOptions(
      screen.getByRole("combobox", { name: /type/i }),
      CustomFieldType.NUMBER
    );
    await user.click(screen.getByRole("button", { name: /add field/i }));

    // Verify error message
    expect(
      screen.getByText(/field with this name already exists/i)
    ).toBeInTheDocument();
    expect(mockOnAddField).not.toHaveBeenCalled();
  });

  it("should validate field name format", async () => {
    const user = userEvent.setup();
    render(<CustomFieldsManager {...defaultProps} />);

    // Try invalid name
    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "123Invalid"
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /type/i }),
      CustomFieldType.TEXT
    );
    await user.click(screen.getByRole("button", { name: /add field/i }));

    expect(screen.getByText(/must start with a letter/i)).toBeInTheDocument();
    expect(mockOnAddField).not.toHaveBeenCalled();
  });

  it("should add valid custom fields", async () => {
    const user = userEvent.setup();
    render(<CustomFieldsManager {...defaultProps} />);

    // Add valid field
    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "TestField"
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /type/i }),
      CustomFieldType.TEXT
    );
    await user.click(screen.getByRole("button", { name: /add field/i }));

    expect(mockOnAddField).toHaveBeenCalledWith({
      name: "TestField",
      type: CustomFieldType.TEXT,
    });
  });
});
