import { loadAllFieldsForProject } from "@/state/fields";
import { loadItemsForProject } from "@/state/items";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetailPage() {
  const { projectNumber } = useParams();

  useEffect(() => {
    loadAllFieldsForProject(Number(projectNumber)).then(() => {
      loadItemsForProject(Number(projectNumber))
    })
  }, [projectNumber])

  return (
    <div>
      <h1>
        Project Detail Page: {projectNumber}
      </h1>
    </div>
  )
}
