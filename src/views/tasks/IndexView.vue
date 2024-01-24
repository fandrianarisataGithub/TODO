<script setup>
import {
  computed,
  ref,
} from 'vue';

import TableTasks from '@/components/blocs/TableTasks.vue';
import Modal from '@/components/elements/ModalElement.vue';
import { useTaskStore } from '@/stores/taskStore';
import { useVuelidate } from '@vuelidate/core';
import {
  helpers,
  required,
} from '@vuelidate/validators';

const closeableModalAdd = ref(false);
    const closeableModalEdit = ref(false);
    const confirmDeleteTaskModal = ref(false);
    const indexToDelete = ref(null);
    const taskStore = useTaskStore();
    const tasks = computed(() => taskStore.tasks);
    const formAdd = ref(null);
    const formEdit = ref(null)
    const quillAdd = ref(null)
    const task = ref({
        id : 1,
        title : '',
        content : '',
        isCompleted : false
    })
    const taskEdit = ref({
        id : null,
        title : '',
        content : '',
        isCompleted : false,
    })
    
    const rules = computed(() => {
        return {
            title: { 
                required : helpers.withMessage('This field cannot be empty', required)
            }, // Matches task.title
        }
    })
    
    // usin Vuelidate for the forms validations
    const v$ = useVuelidate(rules, task);
    const vTaskEdit$ = useVuelidate(rules, taskEdit);

    // add task
    function addTask(){
        v$.value.$validate();
        if(!v$.value.$error){
            // create id for the task
            let tasksLengh = tasks.value.length
            let lastId = tasksLengh > 0 ? tasks.value[tasksLengh - 1].id : 0;
            task.value = {
                id : tasksLengh == 0 ? 1 : lastId + 1,
                title : task.value.title,
                content : task.value.content,
                isCompleted : false
            }
            taskStore.addTask(task.value)
            //closeableModalAdd.value = false;
            //console.log(tasks.value)
            //set it to empty
            task.value = {
                id : '',
                title : '',
                content : '',
                isCompleted : false
            }
            quillAdd.value.setHTML('')
        }
    }
    //close modal delete confirmation
    function closeDeleteModal(){
        confirmDeleteTaskModal.value = false;
    }
    // remove task
    function removeTask(id){
        let index = tasks.value.findIndex((element) => element.id === id); 
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
    function changeStatus(id){
        let index = tasks.value.findIndex((element) => element.id === id);
        //console.log(index)
        tasks.value[index].isCompleted = !tasks.value[index].isCompleted
        let newItem = tasks.value[index];
        tasks.value.splice(index, 1, newItem)
        taskStore.editTask(index, tasks.value[index])
    }

    // edit 
    //open modal for the index array
    function setCloseableModalEditToTrue(id){
        //console.log(id)
        let index = tasks.value.findIndex((element) => element.id === id);
        closeableModalEdit.value = true;
        taskEdit.value = tasks.value[index];
    }
    function editTask($event, id){
        vTaskEdit$.value.$validate();
        if(!vTaskEdit$.value.$error){
            let index = tasks.value.findIndex((element) => element.id === id);
            let editedItem = {
                id : taskEdit.value.id,
                title : taskEdit.value.title,
                content : taskEdit.value.content,
                isCompleted : taskEdit.value.isCompleted
            };
            tasks.value.splice(index, 1, editedItem)
            taskStore.editTask(index, tasks.value[index])
            closeableModalEdit.value = false;
        }
    }
   
</script>

<template>
  <main class="page-tasks">
    <h1 class="my-3">List of tasks</h1>
    <!--button @click="closeableModalAdd = true" type="button" class="btn btn-success mt-2">
      Add new task
    </button-->
    <form class="bloc-form" ref="formAdd" action="">
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
            <quill-editor ref="quillAdd" contentType="html" v-model:content="task.content" theme="snow"></quill-editor>
        </div>
        <div class="form-group">
            <button @click.prevent="addTask" class="btn btn-primary d-block ms-auto my-2">Add</button>
        </div>
      </form>
    <TableTasks :tasks="tasks"
        @changeStatus="changeStatus"
        @setCloseableModalEditToTrue="setCloseableModalEditToTrue"
        @removeTask="removeTask"
    />

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
                <option value="false">Not completed</option>
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
            <button @click.prevent="editTask($event, taskEdit.id)" class="btn btn-primary d-block ms-auto my-2">Save change</button>
        </div>
      </form>
    </Modal>
    <!-- /modal edit -->

    <!-- confirm modal for deleting task -->
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
    <!-- /confirm modal for deleting task -->
  </main>
</template>
<style scoped>
    textarea{
        resize: none;
    }
</style>
