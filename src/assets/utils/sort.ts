import type { TaskItemDetail } from '../types/task'

export const sortTask = (tasks: TaskItemDetail[]): TaskItemDetail[] => {
  const newTasks: TaskItemDetail[] = [...tasks]
  return newTasks.sort((a: TaskItemDetail, b: TaskItemDetail) => {
    if (a.checked > b.checked) return -1
    if (a.checked < b.checked) return 1
    if (a.id < b.id) return -1
    if (a.id > b.id) return 1
    return 0
  })
}
