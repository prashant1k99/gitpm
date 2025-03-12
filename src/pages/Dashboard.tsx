import { Button } from "@/components/ui/button";
import authState from "@/state/auth";
import githubQueries from "@/utils/githubQueries";

export default function DashboardPage() {
  const user = authState.value;

  const loadDataFromGithub = () => {
    githubQueries(user.githubToken as string).then((data) => console.log(data))
  }

  return (
    <div>
      <h1>
        Dashboard Page
      </h1>
      <Button onClick={loadDataFromGithub}> Load data</Button>
    </div>
  )
}
