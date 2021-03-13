import { toRefs, reactive, computed, Ref } from '@vue/reactivity'
import { TodoState, FilterStatus } from '@/components/todo/types'

const useTodo = () => {
  let id = 0

  const todoState = reactive<TodoState>({
    todos: [],
    filterStatus: 'all'
  })

  const { todos, filterStatus } = toRefs(todoState)

  const filterMethods = {
    all() {
      return todos.value
    },
    completed() {
      return todos.value.filter(todo => todo.completed)
    },
    active() {
      return todos.value.filter(todo => !todo.completed)
    }
  }

  const filterTodos = computed(() => filterMethods[filterStatus.value]())

  const addTodo = (text: Ref<string>) => {
    if (text.value.trim()) {
      todos.value.unshift({
        id: id++,
        text: text.value,
        completed: false
      })
      text.value = ''
    }
  }

  const deleteTodo = (id: number) => {
    todos.value = todos.value.filter(todo => todo.id !== id)
  }

  const toggleTodo = (status: FilterStatus) => {
    filterStatus.value = status
  }

  const clearCompletedTodo = () => {
    todos.value = todos.value.filter(todo => !todo.completed)
  }

  const activeItemsLeft = computed(() => todos.value.filter(todo => !todo.completed).length)

  return {
    ...toRefs(todoState),
    filterTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    activeItemsLeft,
    clearCompletedTodo
  }
}

export default useTodo
