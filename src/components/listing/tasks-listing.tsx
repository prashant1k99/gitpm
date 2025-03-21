import { Tasks } from "@/db/schema";
import { Table, TableBody } from "../ui/table";
import TaskRowListing from "./task-row";

export default function TaskListing({ tasks }: {
  tasks: Tasks[]
}) {
  return (
    <Table>
      <TableBody>
        {tasks.map(task => (
          <TaskRowListing key={task.id} task={task} />
        ))}
      </TableBody>
    </Table>
  )
}
