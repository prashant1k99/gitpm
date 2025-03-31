import { TProjectV2QR } from "@/types/projects";
import { LinkIcon, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function ProjectListing({ project }: { project: TProjectV2QR }) {
  return (
    <div className="w-full max-w-xl m-auto bg-sidebar-accent border border-border p-4 rounded-xl gap-4">
      <div className="flex items-center">
        <Button variant={"link"} className="text-lg font-thin mr-2 p-0" asChild>
          <Link to={`project/${project.number}`}>
            <LinkIcon className="w-4 h-4" />
            {project.title}
          </Link>
        </Button>
        {!project.public && (
          <Badge>
            <Lock className="w-4 h-4" />
            Private
          </Badge>
        )}
      </div>
      {project.shortDescription && (
        <div className="text-md p-3">
          {project.shortDescription}
        </div>
      )}
    </div>
  )
}
