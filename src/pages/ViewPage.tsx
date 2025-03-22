import { useParams } from "react-router-dom"

export default function ProjectViewPage() {
  const { projectNumber, viewNumber } = useParams()
  return (
    <>
      <h1>ProjectViewPage</h1>
      <p>{projectNumber} | {viewNumber}</p>
    </>
  )
}
