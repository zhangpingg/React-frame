// 在线地址：https://codesandbox.io/s/reverent-curie-xh1yvc?file=/src/App.tsx:0-2998
import React, { useCallback, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import SortableItem, {ItemStyle} from "./sortableItem";
import { Item } from "./item";

const DragList = () => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const [items, setItems] = useState([
    {
      id: "0",
      content: "拖动我0"
    },
    {
      id: "1",
      content: "拖动我1"
    },
    {
      id: "2",
      content: "拖动我2"
    },
    {
      id: "3",
      content: "拖动我3"
    },
    {
      id: "4",
      content: "拖动我4"
    },
    {
      id: "5",
      content: "拖动我5"
    },
    {
      id: "6",
      content: "拖动我6"
    }
  ]);
  const [activeId, setActiveId] = useState(null);

  /** 拖拽开始 */
  const handleDragStart = useCallback((event: any) => {
    const { active } = event;
    setActiveId(active.id);
  }, [])
  /** 拖拽结束 */
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }, [])
  /** 获取当前拖拽的内容 */
  const getDragContent = useCallback((id: string) => {
    return items.filter((el) => el.id === id)[0].content;
  }, [items]);

  return (
    <div
      style={{
        height: "50vh",
        width: 350,
        overflowY: "auto",
        overflowX: "hidden"
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => {
            return (
              <div key={index} style={{ opacity: item.id === activeId ? 0 : 1 }}>
                <SortableItem key={item.id} id={item.id}>
                  {item.content}
                </SortableItem>
              </div>
            );
          })}
        </SortableContext>
        <DragOverlay>
          {activeId && (
            <Item style={ItemStyle} id={activeId}>
              {getDragContent(activeId)}
            </Item>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default DragList;
