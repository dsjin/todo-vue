export type Group = {
  id: number
  uuid: string
  name: string
  userId: string
  createdAt: number
  updatedAt?: number
}

export type CreateGroup = {
  name: string
}

export type EditGroup = {
  name: string
}
