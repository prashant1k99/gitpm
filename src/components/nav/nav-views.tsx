import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

const subItem = [{
  title: "History",
  url: "#",
},
{
  title: "Starred",
  url: "#",
},
{
  title: "Settings",
  url: "#",
},]

export function NavViews({ project, baseLink }: {
  project: number
  baseLink: string
}) {
  console.log(project, baseLink)
  return (
    <SidebarMenuSub>
      {subItem.map((subItem) => (
        <SidebarMenuSubItem key={subItem.title}>
          <SidebarMenuSubButton asChild>
            <a href={subItem.url}>
              <span>{subItem.title}</span>
            </a>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub >
  )
}

// {views.map((view) => (
//   <SidebarMenuSubItem key={view.name}>
//     <SidebarMenuSubButton asChild>
//       <Link to={`${baseLink}/${view.number}`} >
//         {(() => {
//           const Icon = layoutIcons[view.layout] || Table2;
//           return <Icon className="w-4 h-4 mr-2" />;
//         })()}
//         <span>{view.name}</span>
//       </Link>
//     </SidebarMenuSubButton>
//   </SidebarMenuSubItem>
// ))}
