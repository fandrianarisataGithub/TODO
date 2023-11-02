<script setup>
    import {computed} from 'vue'
    const props = defineProps(['tasks'])
    const emit = defineEmits([
        'setCloseableModalEditToTrue',
        'removeTask',
        'changeStatus'
    ])

    // get tha excerpt of task.tab-content
    function getExcerpt(str) {
        if (str.length > 20) {
            str = str.substring(0,20) + "...";
        }
        return str;
    }

    // count not Completed task 
    const notCompletedTasks = computed (() => {
        let listOfNotcompletedTasks = props.tasks.filter((task) => task.isCompleted === false);
        return listOfNotcompletedTasks.length;
    })
    const handleChangeStatus = (event, id) => {
        emit('changeStatus', id)
    }
    const handleSetCloseableModalEditToTrue = (event, id) => {
        emit('setCloseableModalEditToTrue', id)
    }
    const handleRemoveTask = (event, id) => {
        emit('removeTask', id)
    }

</script>
<template>
    <div class="row my-3">
        <h4>Number of the not completed task{{ notCompletedTasks > 1 ? 's' : '' }} : {{ notCompletedTasks }}</h4>
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
                    <tr v-for="task in tasks" :key="task.id + 1">
                        <th scope="row">{{ task.id }}</th>
                        <td>{{ task.title }}</td>
                        <td v-html="getExcerpt(task.content)"></td>
                        <th>{{ task.isCompleted ? 'Completed' : 'Not completed' }}</th>
                        <td class="td-actions">
                            <router-link 
                                title="Redirect to the task's details"
                                :to="'/tasks/' + task.id"
                                class="btn btn-xs btn-primary mx-2"
                            >
                                Show
                            </router-link>
                            <button 
                                title="Edit task"
                                @click="handleSetCloseableModalEditToTrue($event, task.id)"
                                class="btn btn-secondary btn-xs"
                            >
                                <i class="bi-pencil-square"></i>
                            </button>
                            <button
                                title="Delete task"
                                @click="handleRemoveTask($event, task.id)"
                                class="btn btn-danger btn-xs mx-2"
                            >
                                <i class="bi-trash"></i>
                            </button>
                            <button title="Change the task's status" @click="handleChangeStatus($event, task.id)" class="completed btn btn-xs btn-success">
                                {{task.isCompleted ? 'Set to no completed' : 'Set to completed'}}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>