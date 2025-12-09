"use client";

import { Grid } from "@mui/material";
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
  const [state, setState] = useState<{
    items: Ticket[];
    selected: Ticket[];
  }>(() => ({
    items: getItems(10),
    selected: getItems(5, 10),
  }));

  const getItemStyle = useCallback(
    (
      isDragging: boolean,
      draggableStyle: DraggingStyle | NotDraggingStyle | undefined
    ): CSSProperties => ({
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      padding: grid * 2,
      margin: `0 0 ${grid}px 0`,

      // change background colour if dragging
      background: isDragging ? "lightgreen" : "grey",

      // styles we need to apply on draggables
      ...draggableStyle,
    }),
    []
  );

  const getListStyle = useCallback(
    (isDraggingOver: boolean) => ({
      background: isDraggingOver ? "lightblue" : "lightgrey",
      padding: grid,
      width: 250,
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
        <Grid size={4}>
          <Droppable droppableId="droppable" isDropDisabled={false}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
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
        <Grid size={4}>
          <Droppable droppableId="droppable2" isDropDisabled={false}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {state.selected.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
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
      </DragDropContext>
    </Grid>
  );
};

export default Kanban;
