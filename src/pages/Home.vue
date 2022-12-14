<script setup>
import { onMounted, ref } from 'vue';
import MemberServices from '../firebase/member/member'
import DeviceServices from '../firebase/device/device'
import { DeviceUUID } from 'device-uuid'

const uuid = new DeviceUUID().get();
const inputName = ref('')
const name = ref('')
const isMounted = ref(false)
const members = ref([])
const voted = ref([])
const viewFile = ref('')
const vote = (member) => {
  if (voted.value.length < 3) {
    Swal.fire({
      title: 'Are you sure want to vote this member? This action cannot be undo.',
      showCancelButton: true,
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Voted!', '', 'success')
        MemberServices.update(member.id, { voted: [...(member.voted || []), name.value] })
        voted.value.push(member.id)
        DeviceServices.update(uuid, { voted: voted.value })
      }
    })
  }
}
const login = () => {
  name.value = inputName.value
  DeviceServices.create(uuid, { name: name.value })
}
onMounted(() => {
  DeviceServices.snapshotDevices(data => {
    const existed = data.find(e => e.id === uuid)
    if (existed) {
      name.value = existed.name
      voted.value = existed.voted || []
    }
    isMounted.value = true
  })
  MemberServices.snapshotMembers(data => {
    members.value = data
  })
})
</script>
<template>
  <div v-if="isMounted" class="pt-5">
    <img src="/src/assets/logo-400x400.png" alt="logo" width="100" class="mx-auto">
    <h1 class="text-3xl text-center font-bold mb-2">9thWonder YEP Vote</h1>
    <template v-if="name">
      <div class="text-xl text-center mb-4">
        Hello <span class="font-bold">{{ name }}</span>, <br> you have <span class="font-bold">{{ 3 - voted.length }}</span> ticket remaining.
      </div>
      <div v-if="viewFile" class="fixed top-0 left-0 w-screen h-screen z-[999] flex justify-center items-center bg-[rgba(0,0,0,.5)]" @click="viewFile = ''">
        <img :src="viewFile" alt="" class="max-w-[80vw] max-h-[80vh]" @click.stop>
        <span class="cursor-pointer absolute top-2 right-2 bg-white px-[10px] py-[5px] rounded-full font-bold" @click="viewFile = ''">&#10005</span>
      </div>
      <div class="flex flex-wrap">
        <div v-for="member in members" class="w-1/2 xl:w-1/3 p-2 xl:p-4">
          <div class="text-center shadow-lg">
            <div class="w-full h-[200px] xl:h-[400px] relative border-b-2 cursor-pointer" @click="viewFile = member.avatar">
              <span v-if="voted.includes(member.id)" class="absolute p-2 top-0 left-0 bg-green-500 text-white font-bold z-[2]">Voted ({{ voted.filter(id => id === member.id).length }})</span>
              <img :src="member.avatar" :alt="member.name" class="absolute inset-0 object-cover w-full h-full">
            </div>
            <div class="p-2">
              <h4 class="text-lg my-1 font-semibold">{{ member.name }}</h4>
              <h5 class="text-md my-1 font-semibold">Voted: {{ member.voted && member.voted.length || 0 }}</h5>
              <button
                class="bg-yellow-300 px-5 py-1 rounded-sm font-semibold"
                :disabled="voted.length === 3" @click="vote(member)"
                :class="voted.length === 3 ? 'opacity-50' : ''"
              >
                Vote
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="p-2 mt-5">
      <form
        class="p-10 rounded-md border-4 border-gray-700"
        @submit.stop="login"
      >
        <h1 class="mb-5 text-xl">Enter your name...</h1>
        <div>
          <label for="userName"></label>
          <input
            id="userName"
            v-model="inputName"
            type="text"
            class="border-2 w-full p-2 rounded-sm"
            placeholder="User Name"
          />
        </div>
        <div class="flex justify-between mt-5">
          <button class="py-2 px-10 rounded-sm bg-yellow-300 font-semibold">
            Go Go Go
          </button>
        </div>
      </form>
    </div>
  </div>
</template>