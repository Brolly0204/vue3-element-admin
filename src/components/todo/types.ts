export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export type Todos = TodoItem[]

export type FilterStatus = 'all' | 'active' | 'completed';

export interface TodoState {
  todos: Todos;
  filterStatus: FilterStatus;
}
