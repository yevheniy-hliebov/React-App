type CreateHistoryDto = {
  action: string,
  model: string,
  model_id: number,
  data: string,
  field?: string,
  old_value?: string,
  new_value?: string,
}