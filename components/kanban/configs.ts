import { LabelValue } from "@/app/types";

interface KanbanColumn extends LabelValue {
  color: string;
}

export const KANBAN_COLUMN_OPTIONS: KanbanColumn[] = [
  {
    label: "Backlog",
    value: "BACKLOG",
    color: "#bdbdbd",
  },
  {
    label: "Select for dev",
    value: "SELECT_FOR_DEV",
    color: "#7e57c2",
  },
  {
    label: "Develop",
    value: "DEVELOP",
    color: "#42a5f5",
  },
  {
    label: "QA",
    value: "QA",
    color: "#ff7043",
  },
  {
    label: "Close",
    value: "CLOSE",
    color: "#212121",
  },
];
