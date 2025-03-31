import { ListFilter } from "lucide-react";
import { Button } from "../ui/button";
import { OrganizationDB } from "@/db/organization";
import { useLiveQuery } from "dexie-react-hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { FilterOptionOperations } from "@/state/views";

enum VisibleOptionType {
  Fields,
  Operations,
  Values
}

export function ViewFilter({
  db,
  projectNumber,
  viewNumber,
}: {
  db: OrganizationDB,
  projectNumber: number,
  viewNumber: number,
}) {
  console.log(db, projectNumber, viewNumber)

  const [visbleOptionTypes, setVisibleOptionType] = useState<VisibleOptionType>(VisibleOptionType.Fields)

  const [isOpen, setIsOpen] = useState(false)

  const fields = useLiveQuery(() => {
    return db.fields.where("projectId").equals(Number(projectNumber)).filter(field => !["title", "labels", "linkedpullrequests", "reviewers", "parentissue"].includes(field.fieldQueryName)).toArray()
  }, [projectNumber])


  const handleFieldSelect = (fieldId: string) => {
    console.log(fieldId)
    // setSelectedField(fieldId)
    setVisibleOptionType(VisibleOptionType.Operations)
  }

  const handleOperationSelect = (operation: FilterOptionOperations) => {
    console.log(operation)
    // setSelectedOperation(operation)
    setVisibleOptionType(VisibleOptionType.Values)
  }

  const handleValueSelect = (value: string) => {
    console.log(value)
    // Handle the value selection
    setIsOpen(false) // Only close after final selection
    // Reset states
    setVisibleOptionType(VisibleOptionType.Fields)
  }


  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          <ListFilter />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent >
        {
          visbleOptionTypes == VisibleOptionType.Fields ? (
            fields?.map(field => (
              <DropdownMenuItem
                onClick={() => handleFieldSelect(field.fieldQueryName)}
                onSelect={(e) => e.preventDefault()}
                tabIndex={0}
                key={field.id}
                id={field.id}
              >
                {field.name}
              </DropdownMenuItem>
            ))
          ) :
            visbleOptionTypes === VisibleOptionType.Operations ? (
              Object.values(FilterOptionOperations).map((operation) => (
                <DropdownMenuItem
                  key={operation}
                  // onClick={() => handleOperationSelect(operation)}
                  onSelect={(e) => e.preventDefault()}
                  tabIndex={0}
                >
                  {operation}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem
                tabIndex={0}
                onClick={() => handleValueSelect("test")} // Replace with actual value input
                onSelect={(e) => e.preventDefault()} // Prevent closing
              >
                Enter Value...
              </DropdownMenuItem>
            )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
