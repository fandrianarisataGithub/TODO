<script setup>
    import { onMounted, reactive } from "vue";
    import {useTaskStore} from '@/stores/taskStore';
    import router from './../../../router/index';
    const taskStore = useTaskStore();
    const state = reactive({
        singleTask : {
            id : null,
            title : '',
            content : '',
            isCompleted : false
        }
    })
    onMounted(() => {
        let index = taskStore.tasks.findIndex((element) => element.id == router.currentRoute.value.params.id); 
        if(index == -1 && router.currentRoute.value.params.id){
            router.push({name : 'error404'})
        }
        state.singleTask = taskStore.tasks[index]
        //console.log(state.singleTask)

    })
</script>
<template>
    <div class="page-single-task pt-3">
        <div class="retour">
            <router-link to="/tasks" 
                class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            ><span class="bi-arrow-90deg-left"></span>Back to the list</router-link>
        </div>
        <div class="header d-flex align-items-center">
            <h2 class="mb-3">
                <span v-text="state.singleTask.title"></span>
            </h2>
            <h5 class="mx-2"><span class="badge bg-secondary badge-xs">{{ state.singleTask.isCompleted ? 'Completed' : 'Not completed' }}</span></h5>
        </div>
        <div class="row">
            <hr class="my-3">
            <div class="content">
                <h3><u>Content:</u></h3>
                <div v-html="state.singleTask.content"></div>
            </div>
        </div>
    </div>
</template>