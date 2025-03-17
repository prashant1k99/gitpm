import account from "@/lib/appwrite"
import { useEffect } from "react"

export default function DashboardPage() {
  useEffect(() => {
    account.getSession("current").then((session) => {
      console.log(session)
    })
  })
  return (
    <div>
      <h1>
        Dashboard Page
      </h1>
    </div>
  )
}
