import { useParams } from "react-router-dom";

export default function ViewPage() {
  const { projectNumber, viewNumber } = useParams();
  return (
    <div>
      <h1>
        Project : {projectNumber}
        <br />
        View: {viewNumber}
      </h1>
    </div>
  )
}
