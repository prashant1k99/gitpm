import authState from "@/state/auth";

export default function DashboardPage() {
  const user = authState.value.user;

  return (
    <div>
      <h1>
        Dashboard Page
      </h1>

      {JSON.stringify(user, null, 2)}
    </div>
  )
}
