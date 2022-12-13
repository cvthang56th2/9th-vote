<script setup>
import { onMounted, ref } from 'vue';

const isLoged = ref(false)
const formLogin = ref({})
const members = ref([])
const login = () => {
  if (
    formLogin.value.userName === '9thwonder' &&
    formLogin.value.password === '9thwonder'
  ) {
    isLoged.value = true
    localStorage.setItem('isLoged', 'true')
  }
}
const formMember = ref({})
const addMember = () => {
  const { name, avatar } = formMember.value
  if (name && avatar) {
    members.value.push({ name, avatar })
    formMember.value = {}
  }
}
onMounted(() => {
  isLoged.value = localStorage.getItem('isLoged') === 'true'
})
</script>
<template>
  <div class="p-5">
    <h1 class="text-3xl text-center font-bold mb-5">9thWonder Vote</h1>
    <template v-if="isLoged">
      <div class="p-2 xl:p-4">
        <input v-model="formMember.name" type="text" placeholder="Name" class="border-2 p-1 mb-2">
        <input ref="avatar" id="avatar" type="file" class="mb-2">
        <button class="bg-yellow-300 px-5 py-1 rounded-sm font-semibold" @click="addMember">Add</button>
      </div>
      <div v-for="member in members" class="p-2 xl:p-4">
        <div class="text-center shadow-lg flex">
          <div class="w-1/2 h-[200px] xl:h-[400px] relative">
            <img src="https://via.placeholder.com/1000" alt="" class="absolute inset-0 object-cover w-full h-full">
          </div>
          <div class="w-1/2 p-2">
            <h4 class="text-lg my-1 font-semibold">Name</h4>
            <button class="ml-2 bg-yellow-300 px-5 py-1 rounded-sm font-semibold">Remove</button>
          </div>
        </div>
      </div>
    </template>
    <form
      v-else
      class="p-10 rounded-md border-4 border-gray-700"
      @submit.stop="login"
    >
      <h1 class="mb-5 text-3xl">Login</h1>
      <div>
        <label for="userName"></label>
        <input
          id="userName"
          v-model="formLogin.userName"
          type="text"
          class="border-2 w-full p-2 rounded-sm"
          placeholder="User Name"
        />
      </div>
      <div class="mt-2">
        <label for="password"></label>
        <input
          id="password"
          v-model="formLogin.password"
          type="password"
          class="border-2 w-full p-2 rounded-sm"
          placeholder="Password"
        />
      </div>
      <div class="flex justify-between mt-5">
        <button class="py-2 px-10 rounded-md bg-blue-400 text-white">
          Login
        </button>
      </div>
    </form>
  </div>
</template>