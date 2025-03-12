import orgState from "@/state/organizations";
import { useSignalEffect } from "@preact/signals-react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  useSignalEffect(() => {
    if (orgState.value.activeOrg) {
      navigate("/")
    }
  })
  return (
    <div>Select Organization</div>
  )
}
