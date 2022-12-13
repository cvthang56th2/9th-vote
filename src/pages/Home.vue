<template>
  <div class="p-5">
    <h1 class="text-3xl text-center font-bold mb-5">9thWonder Vote</h1>
    <div class="flex flex-wrap">
      <div v-for="i in [1,2,3,4,5,6,7]" class="w-1/2 xl:w-1/3 p-2 xl:p-4">
        <div class="text-center shadow-lg">
          <div class="w-full h-[200px] xl:h-[400px] relative">
            <img src="https://via.placeholder.com/1000" alt="" class="absolute inset-0 object-cover w-full h-full">
          </div>
          <div class="p-2">
            <h4 class="text-lg my-1 font-semibold">Name</h4>
            <button class="bg-yellow-300 px-5 py-1 rounded-sm font-semibold">Vote</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>