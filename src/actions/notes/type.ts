export type CreateNoteData = {
  title: string;
  description?: string;
  userId: string;
}

export type Note = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}