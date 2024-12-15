import React, { useState } from "react";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, PencilIcon, Plus, Save, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { Input } from "@/components/ui/input";
import { CarSellerNoteFormField, CarSellerText } from "@/types/car";
import { Loader } from "react-feather";
import { cn } from "@/lib/utils";
import useEditSections from "@/hooks/useEditSections";
import useEditParagraph from "@/hooks/useEditParagraph";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/components/QuillEditor"), {
  ssr: false,
});

const SortableParagraph = ({
  noteId,
  paragraph,
}: {
  noteId: string;
  paragraph: CarSellerText;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: paragraph._id });

  const [paragraphText, setParagraphText] = useState(paragraph.text);
  const [paragraphTitle, setParagraphTitle] = useState(paragraph.title);

  const {
    setSections,
    deleteParagraph: {
      mutate: deleteParagraph,
      isLoading: isDeletingParagraph,
    },
    updateParagraph: {
      mutate: updateParagraph,
      isLoading: isUpdatingParagraph,
    },
  } = useEditParagraph(noteId);

  const handleCheckboxChange = () => {
    setSections((prev) =>
      prev.map((s) =>
        s._id === noteId
          ? {
              ...s,
              texts: s.texts?.map((p) =>
                p._id === paragraph._id
                  ? { ...p, checked: !paragraph.checked }
                  : p,
              ),
            }
          : s,
      ),
    );
  };

  const handleLocalCheckboxChange = (isChecked: boolean) => {
    updateParagraph({
      _id: paragraph._id,
      title: paragraphTitle,
      text: paragraphText,
      scope: isChecked ? "local" : "global",
    });
  };

  const handleDeleteParagraph = () => {
    deleteParagraph(paragraph._id);
  };

  const handleUpdateParagraph = () => {
    updateParagraph({
      _id: paragraph._id,
      title: paragraphTitle,
      text: paragraphText,
      scope: "global",
    });
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-4 rounded border border-gray-200 p-2 px-4 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-move">
          <GripVertical className="h-5 w-5 text-gray-500" />
        </div>
        <div className="flex-1">
          <header className="flex gap-3 rounded-md rounded-b-none border border-b-0 border-gray-300 p-1 pl-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`paragraph-${paragraph._id}`}
                checked={paragraph.checked}
                onCheckedChange={handleCheckboxChange}
                className="cursor-pointer"
              />
              <Label className="font-medium text-gray-600">Include</Label>
            </div>
            <Input
              value={paragraphTitle}
              onChange={(e) => setParagraphTitle(e.target.value)}
              type="text"
              className="flex-1"
              placeholder="Paragraph Title"
            />
          </header>
          <div className="quill-editor-container">
            <QuillEditor
              value={paragraphText}
              onChange={setParagraphText}
              className="rounded-b-md"
            />
          </div>
        </div>
        <div className="mt-auto flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={paragraph.scope === "local"}
              onCheckedChange={handleLocalCheckboxChange}
              className="cursor-pointer"
            />
            <Label className="font-medium text-gray-600">Local</Label>
          </div>
          <Button
            size="sm"
            onClick={handleUpdateParagraph}
            disabled={isUpdatingParagraph}
            className="flex items-center gap-2"
          >
            {isUpdatingParagraph ? (
              <Loader size={16} className="animate-spin text-green-500" />
            ) : (
              <Save size={16} color="green" />
            )}
            <span>Save</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteParagraph}
            disabled={isDeletingParagraph}
            className="flex items-center gap-2"
          >
            {isDeletingParagraph ? (
              <Loader size={16} className="animate-spin text-red-500" />
            ) : (
              <Trash size={16} />
            )}
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const SortableSection = ({ section }: { section: CarSellerNoteFormField }) => {
  const [editMode, setEditMode] = useState(false);
  const [sectionTitle, setSectionTitle] = useState(section.title);
  const {
    setSections,
    updateSection: { mutate: updateSection, isLoading: isUpdatingSection },
    deleteSection: { mutate: deleteSection, isLoading: isDeletingSection },
  } = useEditSections();
  const {
    createParagraph: {
      mutate: createParagraph,
      isLoading: isCreatingParagraph,
    },
  } = useEditParagraph(section._id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section._id });

  const handleSectionCheckboxChange = () => {
    setSections((prev) =>
      prev.map((s) =>
        s._id === section._id ? { ...s, checked: !section.checked } : s,
      ),
    );
  };

  const handleSectionTitleChange = () => {
    updateSection({ id: section._id, title: sectionTitle });
    setEditMode(false);
  };

  const handleSectionDelete = () => {
    deleteSection(section._id);
  };

  const handleCreateParagraph = () => {
    createParagraph({
      title: "New Paragraph Title",
      text: "New Paragraph",
      scope: "global",
    });
  };

  const handleParagraphDragEnd = ({ active, over }: DragEndEvent) => {
    if (!section.texts || !over) return;
    if (active.id !== over.id) {
      const oldIndex = section.texts.findIndex(
        (item) => item._id === active.id,
      );
      const newIndex = section.texts.findIndex((item) => item._id === over.id);

      const newTexts = arrayMove(section.texts, oldIndex, newIndex);
      setSections((prev) =>
        prev.map((s) =>
          s._id === section._id ? { ...s, texts: newTexts } : s,
        ),
      );
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-2 rounded-md border bg-white p-2"
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move py-1"
          title="Drag Section"
        >
          <GripVertical className="h-5 w-5 text-gray-500" />
        </div>
        <Checkbox
          checked={section.checked}
          onCheckedChange={handleSectionCheckboxChange}
          className="cursor-pointer"
        />
        {!editMode ? (
          <Label className="font-bold capitalize">
            {section.title ?? "Section Title"}
          </Label>
        ) : (
          <Input
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            type="text"
            placeholder="Section Title"
          />
        )}
        <div className="right mx-4 flex gap-4">
          {!editMode ? (
            <PencilIcon
              className="cursor-pointer"
              size="1em"
              onClick={() => setEditMode(true)}
            />
          ) : (
            <>
              <X
                size="1em"
                className="cursor-pointer"
                onClick={() => setEditMode(false)}
              />
              {isUpdatingSection ? (
                <Loader size={16} className="animate-spin text-green-500" />
              ) : (
                <Save
                  size="1em"
                  className="cursor-pointer text-green-500"
                  onClick={handleSectionTitleChange}
                />
              )}
            </>
          )}
          {isDeletingSection ? (
            <Loader size={16} className="animate-spin text-red-500" />
          ) : (
            <Trash
              size="1em"
              className="cursor-pointer text-red-500"
              onClick={handleSectionDelete}
            />
          )}
        </div>

        <Button
          variant="secondary"
          onClick={handleCreateParagraph}
          className={cn("ml-auto", {
            "animate-pulse cursor-not-allowed opacity-50": isCreatingParagraph,
          })}
        >
          {isCreatingParagraph ? (
            <Loader size={20} className="mr-2 animate-spin" />
          ) : (
            <Plus size={20} className="mr-2" />
          )}
          Add Paragraph
        </Button>
      </div>

      <div className="space-y-2">
        {section.texts && (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleParagraphDragEnd}
          >
            <SortableContext
              items={section.texts.map((t) => t._id)}
              strategy={verticalListSortingStrategy}
            >
              {section.texts.map((paragraph) => (
                <SortableParagraph
                  key={paragraph._id}
                  paragraph={paragraph}
                  noteId={section._id}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

const SellerNotes = () => {
  const {
    sections,
    setSections,
    createSection: { mutate: createSection, isLoading: isCreatingSection },
    getSections: { isLoading: isFetchingSections },
    saveOrder: { mutate: saveOrder, isLoading: isPatching },
  } = useEditSections();

  const handleAddSection = () => {
    createSection(`New Section ${sections.length + 1}`);
  };

  const handleSectionDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex((item) => item._id === active.id);
      const newIndex = sections.findIndex((item) => item._id === over?.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);
    }
  };

  return (
    <div className="container-md my-8 space-y-2">
      <header className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Label className="font-medium text-gray-700">
            Seller{"'"}s Notes
          </Label>
          <div className="h-6 w-px bg-gray-300"></div>
          {isPatching ? (
            <Loader className="animate-spin text-gray-500" size="1.25em" />
          ) : (
            <Button
              title="Save Order"
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              onClick={saveOrder}
            >
              <Save size="1.25em" className="cursor-pointer" />
              <span className="text-sm font-medium">Save Order</span>
            </Button>
          )}
        </div>
      </header>
      {isFetchingSections ? (
        <Loader className="mx-auto mt-4 animate-spin" size={24} />
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext
            items={sections.map((section) => section._id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <SortableSection key={section._id} section={section} />
            ))}
            <Button
              onClick={handleAddSection}
              className="mt-4 w-full"
              disabled={isCreatingSection}
            >
              {isCreatingSection ? (
                <Loader className="mr-2 animate-spin" size={20} />
              ) : (
                <Plus size={24} className="mr-2" />
              )}
              Add Section
            </Button>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default SellerNotes;
