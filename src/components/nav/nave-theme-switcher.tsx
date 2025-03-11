import { Moon, SunMedium } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "../theme-provider";

export function NavThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme == "light" ? "dark" : "light")
  }

  return (
    <Button variant={"ghost"} size={"icon"} onClick={toggleTheme}>
      {theme == "light" ? <Moon className='w-5 h-5' /> : <SunMedium className='w-5 h-5' />}
    </Button>
  )
}
