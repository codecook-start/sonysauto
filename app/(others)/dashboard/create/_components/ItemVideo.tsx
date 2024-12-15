"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, CSSProperties } from "react";
import { Plus, Trash, GripVertical } from "lucide-react";
import { useAtom } from "jotai";
import { CarLocalAtom } from "@/jotai/dashboardAtom";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";

type SortableItemProps = {
  id: string;
  video: string;
  onChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  length: number;
};

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  video,
  onChange,
  onRemove,
  length,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded bg-white py-2"
    >
      <div
        {...attributes}
        {...listeners}
        className="mb-1.5 mt-auto cursor-move py-1"
        title="Drag"
      >
        <GripVertical className="h-5 w-5 text-gray-500" />
      </div>
      <div className="flex w-full items-center gap-2">
        <Input
          type="text"
          placeholder="https://www.youtube.com/watch?v=video-id"
          value={video}
          onChange={(e) => onChange(id, e.target.value)}
          className="w-full flex-1 border p-4"
        />
        {length > 1 && (
          <Button
            onClick={() => onRemove(id)}
            variant="destructive"
            aria-label="Remove Video"
          >
            <Trash size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

const ItemVideo = () => {
  const [car, setCar] = useAtom(CarLocalAtom);
  const [videos, setVideos] = useState<{ id: string; url: string }[]>(
    (car.videos || []).map((video) => ({
      id: uuidv4(),
      url: video,
    })),
  );
  const handleAddVideo = () =>
    setVideos([...videos, { id: uuidv4(), url: "" }]);

  const handleChangeVideo = (id: string, value: string) => {
    const updatedVideos = [...videos];
    const index = updatedVideos.findIndex((video) => video.id === id);
    updatedVideos[index].url = value;
    setVideos(updatedVideos);
  };

  const handleRemoveVideo = (id: string) => {
    setVideos(videos.filter((video) => video.id !== id));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setVideos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    setCar((prevCar) => ({
      ...prevCar,
      videos: videos.map((video) => video.url),
    }));
  }, [videos, setCar]);

  return (
    <div className="container-md my-8 space-y-4">
      <Label>Videos</Label>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={videos.map((video) => video.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4">
            {videos.map((video) => (
              <SortableItem
                key={video.id}
                id={video.id}
                video={video.url}
                onChange={handleChangeVideo}
                onRemove={handleRemoveVideo}
                length={videos.length}
              />
            ))}
            <Button
              className="flex flex-1 items-center justify-center rounded-md border bg-neutral-100 py-3 text-black hover:text-white"
              onClick={handleAddVideo}
              aria-label="Add Video"
            >
              <Plus size={20} />
            </Button>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ItemVideo;
