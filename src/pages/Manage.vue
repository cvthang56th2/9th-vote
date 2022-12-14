<script setup>
import { onMounted, ref } from 'vue';
import MemberServices from '../firebase/member/member'

const isLoged = ref(false)
const previewSrc = ref(null)
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
  const avatarEl = document.querySelector('#avatar')
  const avatar = avatarEl.files[0]
  const { name } = formMember.value
  if (name && avatar) {
    MemberServices.create({ name, avatar })
    members.value.push({ name, avatar })
    formMember.value = {}
    avatarEl.value = ''
    avatarEl.type = 'text'
    avatarEl.type = 'file'
    previewSrc.value = null
    Swal.fire('Added!', '', 'success')
  }
}
const onChangeFileImage = event => {
  let reader = new FileReader();
  let file = event.target.files[0];

  reader.onload = event => {
    previewSrc.value = event.target.result
  };

  reader.readAsDataURL(file);
}
const remove = (memberId) => {
  Swal.fire({
    title: 'Are you sure want to remove this item? This action cannot be undo.',
    showCancelButton: true,
    confirmButtonText: 'Remove',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Removed!', '', 'success')
      MemberServices.remove(memberId)
    }
  })
}
const sortMembers = () => {
  members.value = members.value.sort((a, b) => {
    return ((a.voted && a.voted.length) || 0) < ((b.voted && b.voted.length) || 0) ? 1 : -1
  })
}
onMounted(() => {
  isLoged.value = localStorage.getItem('isLoged') === 'true'

  MemberServices.snapshotMembers(data => {
    members.value = data
  })
})
</script>
<template>
  <div class="p-5">
    <h1 class="text-3xl text-center font-bold mb-5">9thWonder Vote</h1>
    <template v-if="isLoged">
      <div class="mb-4 p-2 border-2">
        <div>
          <input v-model="formMember.name" type="text" placeholder="Name" class="border-2 p-1 mb-3">
        </div>
        <div>
          <input ref="avatar" id="avatar" accept="image/*" type="file" class="mb-3" @change="onChangeFileImage">
        </div>
        <div v-if="previewSrc" class="mb-3 border-2 flex justify-center">
          <img :src="previewSrc" alt="preview">
        </div>
        <div>
          <button class="bg-yellow-300 px-5 py-1 rounded-sm font-semibold" @click="addMember">Add</button>
        </div>
      </div>
      <div class="mb-5">
        <button class="bg-yellow-300 px-5 py-1 rounded-sm font-semibold" @click="sortMembers">Sort by vote</button>
      </div>
      <div v-for="(member, mIndex) in members" :key="`member-${member.id}`" class="mb-4">
        <div class="text-center shadow-lg flex">
          <div class="w-1/2 h-[200px] xl:h-[400px] relative shadow-md">
            <img :src="member.avatar" alt="" class="absolute inset-0 object-cover w-full h-full">
          </div>
          <div class="w-1/2 p-2">
            <h4 class="text-lg my-1 font-semibold">{{ member.name }}</h4>
            <h5 class="text-md my-1 font-semibold">Voted: {{ (member.voted && member.voted.length) || 0 }}</h5>
            <button class="ml-2 bg-yellow-300 px-5 py-1 rounded-sm font-semibold" @click="remove(member.id)">Remove</button>
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