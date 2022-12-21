<script setup>
import { computed, onMounted, ref } from 'vue';
import MemberServices from '../firebase/member/member'
import DeviceServices from '../firebase/device/device'
import SettingsServices from '../firebase/settings/settings'

function filterSeal (str) {
  str = typeof str === 'string' ? str : ''
  str = str.toLowerCase()
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/[^a-zA-Z0-9 ]/g, ' ')
  str = (str).trim()

  // str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-")
  /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
  // str= str.replace(/-+-/g,"-") //thay thế 2- thành 1-
  // str = str.replace(/^\-+|\-+$/g, '')
  // cắt bỏ ký tự - ở đầu và cuối chuỗi
  return str
}
const isShowResult = ref(false)

const inputName = ref('')
const name = ref('')
const isMounted = ref(false)
const isSortByVote = ref(false)
const members = ref([])
const voted = ref([])
const viewFile = ref('')
const existed = ref(null)
const users = ref([])
const keyword = ref('')
const computedMembers = computed(() => {
  let results = JSON.parse(JSON.stringify(members.value))
  if (keyword.value) {
    const reg = new RegExp(keyword.value, 'gi')
    results = results.filter(e => e.name && filterSeal(e.name).match(reg))
  }
  if (isSortByVote.value) {
    results = results.sort((a, b) => {
      return ((a.voted && a.voted.length) || 0) < ((b.voted && b.voted.length) || 0) ? 1 : -1
    })
  }
  return results
})
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
        DeviceServices.update(name.value, { voted: voted.value })
      }
    })
  }
}
const login = () => {
  const nameLc = String(inputName.value || '').toLocaleLowerCase()
  existed.value = users.value.find(e => e.id === nameLc)
  if (existed.value) {
    name.value = nameLc
    localStorage.setItem('9thName', name.value)
    updateUserVoted()
    inputName.value = ''
  } else {
    Swal.fire('Not valid user!')
  }
}
const logout = () => {
  Swal.fire({
    title: 'Are you sure want to logout?',
    showCancelButton: true,
    confirmButtonText: 'OK',
  }).then((result) => {
    if (result.isConfirmed) {
      name.value = null
      localStorage.setItem('9thName', '')
    }
  })
}
const updateUserVoted = () => {
  existed.value = users.value.find(e => e.id === String(name.value || '').toLocaleLowerCase())
  if (existed.value) {
    name.value = existed.value.name
    voted.value = existed.value.voted || []
  } else {
    name.value = null
  }
}
onMounted(async () => {
  name.value = localStorage.getItem('9thName')
  const appSettings = await SettingsServices.get('app')
  isShowResult.value = appSettings.isShowResult

  DeviceServices.snapshotDevices(data => {
    users.value = data
    updateUserVoted()
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
        Hello <span class="font-bold">{{ name }}</span>, <br> you have <span class="font-bold">{{ 3 - voted.length }}</span> ticket{{ 3 - voted.length < 2 ? '' : 's' }} remaining.
        <br>
        <button class="underline hover:text-blue-500" @click="logout">Logout</button>
      </div>
      <div v-if="viewFile" class="fixed top-0 left-0 w-screen h-screen z-[999] flex justify-center items-center bg-[rgba(0,0,0,.5)]" @click="viewFile = ''">
        <img :src="viewFile" alt="" class="max-w-[80vw] max-h-[80vh]" @click.stop>
        <span class="cursor-pointer absolute top-2 right-2 bg-white px-[10px] py-[5px] rounded-full font-bold" @click="viewFile = ''">&#10005</span>
      </div>
      
      <div class="mb-4 px-2 flex">
        <input
          id="keyword"
          v-model="keyword"
          type="text"
          class="border-2 w-full p-2 rounded-sm"
          placeholder="Search by name..."
        />
        <div v-if="isShowResult" class="w-1/2 pl-5 flex items-center">
          <input v-model="isSortByVote" type="checkbox" class="w-[20px] h-[20px] mr-2" id="sort-by-vote">
          <label for="sort-by-vote" class="cursor-pointer font-semibold">Sort by vote</label>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div v-for="(member, mIndex) in computedMembers" :key="`member-${mIndex}`" class="w-1/2 xl:w-1/3 p-2 xl:p-4">
          <div class="text-center shadow-lg border-2">
            <div class="w-full h-[200px] md:h-[300px] xl:h-[400px] relative border-b-2 cursor-pointer" @click="viewFile = member.avatar">
              <span v-if="voted.includes(member.id)" class="absolute p-2 top-0 left-0 bg-green-500 text-white font-bold z-[2]">Voted ({{ voted.filter(id => id === member.id).length }})</span>
              <img :src="member.avatar" :alt="member.name" class="absolute inset-0 object-cover w-full h-full">
            </div>
            <div class="p-2">
              <h4 class="text-lg my-1 font-semibold">{{ member.name }}</h4>
              <h5 v-if="isShowResult" class="text-md my-1 font-semibold">Voted: {{ member.voted && member.voted.length || 0 }}</h5>
              <h5 v-else class="text-md my-1 font-semibold">Voted: ---</h5>
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
        <h1 class="mb-5 text-xl">Enter your teams'name...(ex: thang.cao, trang.t.nguyen, tien.m.nguyen...)</h1>
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