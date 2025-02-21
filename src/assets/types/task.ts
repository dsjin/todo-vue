export type TaskItemDetail = {
  id: number
  uuid: string
  text: string
  checked: boolean
  createdAt: number
  updatedAt?: number
}

export type createTask = {
  text: string
}
