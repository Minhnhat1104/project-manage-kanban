import React from "react";
import KanbanComponent from "@components/kanban";
import { Stack } from "@mui/material";

const Kanban = () => {
  return (
    <Stack sx={{ width: 1, p: 2 }}>
      <KanbanComponent />
    </Stack>
  );
};

export default Kanban;
