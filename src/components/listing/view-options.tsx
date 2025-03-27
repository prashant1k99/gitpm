import { useLiveQuery } from "dexie-react-hooks";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"; import { OrganizationDB } from "@/db/organization";
import { useEffect, useState } from "react";
import { Field } from "@/db/schema";
import { setGroupByOptions, setViewLayout, toggleFieldVisible, viewOptionState } from "@/state/views";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import { Kanban, Logs, Settings2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { IViewLayout } from "@/types/common";
import { useSignalEffect } from "@preact/signals-react";
import { DataType } from "@/types/fields";

export function ViewOptions({
  db,
  projectNumber,
  viewNumber,
}: {
  db: OrganizationDB,
  projectNumber: number,
  viewNumber: number,
}) {
  console.log(viewNumber)
  const [groupByField, setGroupByField] = useState<Field | null>(null)
  const [layout, setLayout] = useState<IViewLayout>(IViewLayout.TABLE_LAYOUT)
  const [fieldOptions, setFieldOptions] = useState<Field[]>([])

  const [selectedFieldOptions, setSelectedFieldOptions] = useState<string[]>([])

  const fields = useLiveQuery(() => {
    return db.fields.where("projectId").equals(Number(projectNumber)).filter(field => !["title", "labels", "linkedpullrequests", "reviewers", "parentissue"].includes(field.fieldQueryName)).filter(field => field.dataType != "DATE").toArray()
  })

  useEffect(() => {
    setGroupByOptions(groupByField || undefined)
  }, [groupByField])

  const handleGroupByChange = (value: string) => {
    if (value == "null") {
      setGroupByField(null)
    }
    setGroupByField(fields?.find((field) => field.fieldQueryName == value) || null)
  }

  const constantDisplayFields = [
    { name: "Description", id: "const_description" },
    { name: "Created Date", id: "const_createdAt" },
    { name: "Updated Date", id: "cosnt_updatedAt" },
    { name: "Assignee", id: "const_assignee" },
    { name: "Labels", id: "const_labels" }
  ]

  useEffect(() => {
    // Supported field types
    const supportedFields = fields?.filter(
      field => [
        DataType.DATE,
        DataType.NUMBER,
        DataType.TEXT,
        DataType.MILESTONE,
        DataType.ITERATION,
        DataType.SINGLE_SELECT,
        DataType.SUB_ISSUES_PROGRESS,
      ].includes(field.dataType)
    ) || []
    console.log("Fields: ", fields)
    console.log(supportedFields)
    setFieldOptions(
      supportedFields
    )
  }, [fields])

  useSignalEffect(() => {
    setLayout(viewOptionState.value.layout)
  })

  useSignalEffect(() => {
    setSelectedFieldOptions(viewOptionState.value.fieldsVisible)
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings2 />
          Display
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 flex flex-col gap-2.5 bg-sidebar border border-border p-3 rounded-xl">
        <div className="flex justify-around gap-2">
          <div onClick={() => setViewLayout(IViewLayout.TABLE_LAYOUT)} className={`flex flex-col w-full border p-2 justify-center items-center rounded-lg hover:bg-accent cursor-pointer ${layout == IViewLayout.TABLE_LAYOUT && "bg-accent"}`}>
            <Logs />
            <div className="text-sm font-light">
              List
            </div>
          </div>
          <div onClick={() => setViewLayout(IViewLayout.BOARD_LAYOUT)} className={`flex flex-col w-full border p-2 justify-center items-center rounded-lg hover:bg-accent cursor-pointer ${layout == IViewLayout.BOARD_LAYOUT && "bg-accent"}`}>
            <Kanban />
            <div className="text-sm font-light">
              Board
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex items-center text-sm font-light">
            Grouping
          </div>
          <Select onValueChange={handleGroupByChange} value={groupByField?.fieldQueryName || 'null'}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="Group By" className="text-xs" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Group By Field</SelectLabel>
                {fields?.map(field => (
                  <SelectItem key={field.id} value={field.fieldQueryName} className="text-sm">{field.name}</SelectItem>
                ))}
                <SelectItem value="null" className="text-sm">No Grouping</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Separator />
        <p className="text-sm font-light">List Options</p>
        <span className="text-xs font-extralight">Display properties</span>
        <div className="flex flex-wrap gap-2">
          {constantDisplayFields.map(field =>
            <div onClick={() => toggleFieldVisible(field.id)} key={field.id}
              className={`cursor-pointer select-none font-light text-sm w-fit p-0 px-2 rounded-md ${selectedFieldOptions.includes(field.id) && "bg-sidebar-accent border border-accent-foreground"}`}>
              {field.name}
            </div>
          )}
          {fieldOptions.map(field =>
            <div onClick={() => toggleFieldVisible(field.fieldQueryName)} key={field.id}
              className={`cursor-pointer font-light select-none text-sm w-fit p-0 px-2 rounded-md ${selectedFieldOptions.includes(field.fieldQueryName) && "bg-sidebar-accent border border-accent-foreground"}`}>
              {field.name}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}
