<script setup>
    import {computed, ref} from 'vue'
    import Modal from '@/components/elements/ModalElement.vue'
    import {useTaskStore} from '@/stores/taskStore'
    import { useVuelidate } from '@vuelidate/core'
    import { helpers, required } from '@vuelidate/validators'
    const closeableModalAdd = ref(false);
    const closeableModalEdit = ref(false);
    const confirmDeleteTaskModal = ref(false);
    const indexToDelete = ref(null);
    const taskStore = useTaskStore();
    const tasks = computed(() => taskStore.tasks);
    const formAdd = ref(null);
    const formEdit = ref(null)
    const task = ref({
        title : '',
        content : '',
        isCompleted : false
    })
    const taskEdit = ref({
        title : '',
        content : '',
        isCompleted : false,
        index : null
    })
    
    const rules = computed(() => {
        return {
            title: { 
                required : helpers.withMessage('This field cannot be empty', required)
            }, // Matches task.title
        }
    })
    
    const v$ = useVuelidate(rules, task);
    const vTaskEdit$ = useVuelidate(rules, taskEdit);

    // add task
    async function addTaskFromHome(){
        //console.log(task.value.content);
        v$.value.$validate();
        if(!v$.value.$error){
            await taskStore.addTask(task.value)
            closeableModalAdd.value = false;
            task.value = {
                title : '',
                content : '',
                isCompleted : false
            }
        }
    }
    //close modal delete confirmation
    function closeDeleteModal(){
        confirmDeleteTaskModal.value = false;
    }
    // remove task
    function removeTask(index){
      if (index > -1){
        indexToDelete.value = index;
        confirmDeleteTaskModal.value = true;
      }
    }
    function deleteTheTask(){
        tasks.value.splice(indexToDelete.value, 1);
        confirmDeleteTaskModal.value = false;
    }

    // toggle status
    function changeStatus(index){
        tasks.value[index].isCompleted = !tasks.value[index].isCompleted
        let newItem = tasks.value[index];
        tasks.value.splice(index, 1, newItem)
        taskStore.editTask(index, tasks.value[index])
    }

    // edit 
    //open modal for the index array
    function setCloseableModalEditToTrue(index){
        closeableModalEdit.value = true;
        taskEdit.value = tasks.value[index];
        taskEdit.value.index = index;
    }
    function editTaskFromHome(){
        vTaskEdit$.value.$validate();
        if(!vTaskEdit$.value.$error){
            let index = taskEdit.value.index;
            let editedItem = {
                title : taskEdit.value.title,
                content : taskEdit.value.content,
                isCompleted : taskEdit.value.isCompleted
            };
            tasks.value.splice(index, 1, editedItem)
            taskStore.editTask(index, tasks.value[index])
            closeableModalEdit.value = false;
        }
    }
    // count no Completed task 
    const noCompletedTasks = computed (() => {
        let listOfNocompletedTasks = tasks.value.filter((task) => task.isCompleted === false);
        return listOfNocompletedTasks.length;
    })
    
   
</script>

<template>
  <main>
    <h1>Home</h1>
    <button @click="closeableModalAdd = true" type="button" class="btn btn-success mt-3">
      Open Closeable Modal
    </button>
    <Modal 
        v-model="closeableModalAdd" 
        closeable 
        header="Add new task"
    >
      <form ref="formAdd" action="">
        <div 
            :class="{ error: v$.title.$errors.length }"
            class="form-group"
        >
            <label for="add-title">Title*:</label>
            <input v-model="task.title" class="form-control" id="add-title" type="text" required>
            <div class="input-errors" v-for="error of v$.title.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
            </div>
        </div>
        <div 
            class="form-group"
        >
            <label for="add-content">Content*:</label>
            <quill-editor contentType="html" v-model:content="task.content" theme="snow"></quill-editor>
        </div>
        <div class="form-group">
            <button @click.prevent="addTaskFromHome" class="btn btn-primary d-block ms-auto my-2">Add</button>
        </div>
      </form>
    </Modal>
    <!-- modal edit -->
    <Modal 
        v-model="closeableModalEdit" 
        closeable 
        header="Edit this task"
    >
      <form ref="formEdit" action="">
        <div 
            :class="{ error: vTaskEdit$.title.$errors.length }"
            class="form-group"
        >
            <label for="add-title">Title*:</label>
            <input v-model="taskEdit.title" class="form-control" id="add-title" type="text" required>
            <div class="input-errors" v-for="error of vTaskEdit$.title.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
            </div>
        </div>
        <div class="form-group">
            <label for="status">Status*:</label>
            <select 
                v-model="taskEdit.isCompleted" 
                name="" id=""
                class="form-control"
            >
                <option value="false">Unfinished</option>
                <option value="true">Completed</option>
            </select>
        </div>
        <div 
            class="form-group"
        >
            <label for="add-content">Content*:</label>
            <quill-editor contentType="html" v-model:content="taskEdit.content" theme="snow"></quill-editor>
        </div>
        <div class="form-group">
            <button @click.prevent="editTaskFromHome" class="btn btn-primary d-block ms-auto my-2">Save change</button>
        </div>
      </form>
    </Modal>
    <!-- end modal edit -->
    <Modal 
        v-model="confirmDeleteTaskModal" 
        closeable 
        header="Do you really want to remove this task?"
    >
      <p class="d-flex justify-content-between align-page-item">
        <button @click="deleteTheTask" type="button" class="btn btn-xs btn-danger">OK</button>
        <button @click="closeDeleteModal" class="btn btn-xs btn-secondary">Cancel</button>
      </p>
    </Modal>
    <div class="row my-3">
        <h2 class="my-3">List of tasks</h2>
        <h4>Number of the not completed task{{ noCompletedTasks > 1 ? 's' : '' }} : {{ noCompletedTasks }}</h4>
        <div class="array-content my-3">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(task, index) in tasks" :key="index">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ task.title }}</td>
                        <td v-html="task.content"></td>
                        <th>{{ task.isCompleted ? 'Completed' : 'No completed' }}</th>
                        <td class="td-actions">
                            <button 
                                @click = "setCloseableModalEditToTrue(index)"
                                class="btn btn-secondary btn-xs"
                            >
                                <i class="bi-pencil-square"></i>
                            </button>
                            <button
                                @click="removeTask(index)"
                                class="btn btn-danger btn-xs mx-2"
                            >
                                <i class="bi-trash"></i>
                            </button>
                            <button @click="changeStatus(index)" class="completed btn btn-xs btn-success">
                                {{task.isCompleted ? 'Set to no completed' : 'Set to completed'}}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </main>
</template>
<style scoped>
    textarea{
        resize: none;
    }
</style>
