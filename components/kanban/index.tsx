"use client";

import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import React, { CSSProperties, useCallback, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { KANBAN_COLUMN_OPTIONS } from "./configs";

interface Ticket {
  id: string;
  content: string;
}

// fake data generator
const getItems = (count: number, offset = 0): Ticket[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }));

const grid = 8;

const Kanban = () => {
  const theme = useTheme();
  const [state, setState] = useState<{
    items: Ticket[];
    selected: Ticket[];
  }>(() => ({
    items: getItems(10),
    selected: getItems(5, 10),
  }));

  const getListStyle = useCallback(
    (isDraggingOver: boolean) => ({
      background: isDraggingOver ? "lightblue" : "transparent",
      padding: 8,
    }),
    []
  );

  // a little function to help us with reordering the result
  const reorder = useCallback(
    (list: unknown[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
    },
    []
  );

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  const id2List: Record<string, "items" | "selected"> = {
    droppable: "items",
    droppable2: "selected",
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = useCallback(
    (
      source: any,
      destination: any,
      droppableSource: DraggableLocation,
      droppableDestination: DraggableLocation
    ) => {
      const sourceClone = Array.from(source);
      const destClone = Array.from(destination);
      const [removed] = sourceClone.splice(droppableSource.index, 1);

      destClone.splice(droppableDestination.index, 0, removed);

      const result: any = {};
      result[droppableSource.droppableId] = sourceClone;
      result[droppableDestination.droppableId] = destClone;

      return result;
    },
    []
  );

  const onDragEnd: OnDragEndResponder = useCallback(
    (result) => {
      const { source, destination } = result;

      // dropped outside the list
      if (!destination) {
        return;
      }

      const getList = (id: string) => state[id2List[id]];

      if (source.droppableId === destination.droppableId) {
        const items = reorder(
          getList(source.droppableId),
          source.index,
          destination.index
        );
        console.log(
          "🚀 ~ items:",
          getList(source.droppableId),
          source.index,
          destination.index
        );

        setState((prev) => ({
          ...prev,
          [source.droppableId === "droppable2" ? "selected" : "items"]: items,
        }));
      } else {
        const result: any = move(
          getList(source.droppableId),
          getList(destination.droppableId),
          source,
          destination
        );
        console.log("🚀 ~ result:", result);

        setState({
          items: result.droppable,
          selected: result.droppable2,
        });
      }
    },
    [state]
  );

  return (
    <Grid container spacing={2}>
      <DragDropContext onDragEnd={onDragEnd}>
        {KANBAN_COLUMN_OPTIONS?.map((_column, i, arr) => (
          <Grid
            key={_column?.value}
            size={12 / arr?.length}
            sx={{ background: theme.palette.grey.A100, borderRadius: 2 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              borderBottom={1}
              sx={{ px: 2, py: 1 }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  display: "flex",
                  borderRadius: 999,
                  mr: 1,
                  background: _column?.color,
                }}
              />
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                {_column?.label}
              </Typography>
            </Stack>
            <Droppable droppableId={_column?.value} isDropDisabled={false}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {state.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: "none",
                            padding: grid * 2,
                            margin: `0 0 ${grid}px 0`,
                            borderRadius: 8,
                            border: `1px solid ${theme.palette.grey[400]}`,
                            // change background colour if dragging
                            background: snapshot.isDragging
                              ? "lightgreen"
                              : theme.palette.common.white,
                            ...provided.draggableProps.style,
                          }}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Grid>
        ))}
      </DragDropContext>
    </Grid>
  );
};

export default Kanban;
