import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('taskStore', () => {
  const countTask = ref(0)
  const tasks = ref([]);
  function increment() {
    countTask.value++
  }
  function addTask(payload){
    tasks.value.push(payload);
    //console.log(tasks.value)
  }
  function editTask(index, updatedTask) {
    if (index >= 0 && index < tasks.value.length) {
      tasks.value[index] = updatedTask
      //console.log(tasks.value[index])
    }
  }
  return { countTask, increment, addTask, tasks, editTask }
})
