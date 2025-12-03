import { ViewMode } from "@/app/shared/types/enums";

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export type { ViewToggleProps };
