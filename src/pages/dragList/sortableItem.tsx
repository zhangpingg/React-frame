import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Item } from "./item";

export var ItemStyle:any = null;

const SortableItem = (props: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  }:any = useSortable({ id: props.id });

  ItemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    color: "red",
    border: "1px solid #ccc",
    marginBottom: "10px",
    boxShadow: "4px 4px 4px #ccc",
    height: 30
  };

  return (
    <Item ref={setNodeRef} style={ItemStyle} {...attributes} {...listeners}>
      {props.children}
    </Item>
  );
}

export default SortableItem;
