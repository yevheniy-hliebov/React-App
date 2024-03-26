import { Task, TaskList } from "@prisma/client";

export type TaskWithTaskList = Task & {
  tasklist?: TaskList
}