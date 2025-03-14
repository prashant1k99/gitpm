import { useParams } from "react-router-dom";

export default function ProjectDetailPage() {
  const { projectNumber } = useParams();
  return (
    <div>
      <h1>
        Project Detail Page: {projectNumber}
      </h1>
    </div>
  )
}
