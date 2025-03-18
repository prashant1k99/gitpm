import { loadAllFieldsForProject } from "@/state/fields";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetailPage() {
  const { projectNumber } = useParams();

  useEffect(() => {
    loadAllFieldsForProject(Number(projectNumber)).then((data) => {
      console.log(data)
    })
  }, [])

  return (
    <div>
      <h1>
        Project Detail Page: {projectNumber}
      </h1>
    </div>
  )
}
