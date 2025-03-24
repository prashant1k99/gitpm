import authState from "@/state/auth"

export default function DashboardPage() {
  console.log(authState.value.user)
  return (
    <div>
      <h1>
        Dashboard Page
      </h1>
    </div>
  )
}
