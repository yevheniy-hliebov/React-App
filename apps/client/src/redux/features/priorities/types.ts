export type Priority = {
  id: number;
  name: string;
}

export type PrioritiesState = {
  priorities: Priority[];
  loading: boolean;
  error: string | null | undefined;
};