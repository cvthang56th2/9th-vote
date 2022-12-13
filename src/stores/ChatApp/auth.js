import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)

  return {
    currentUser
  }
})