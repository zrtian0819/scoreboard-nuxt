<template>
  <div class="max-w-xl mx-auto p-5 bg-gray-50 rounded-lg shadow-md">
    <h2 class="text-center text-xl font-bold text-gray-800 mb-5">記分板</h2>
    <div class="flex justify-between gap-5">
      <div class="flex-1 text-center p-4 bg-white rounded-lg shadow">
        <h3 class="mt-0 text-gray-700 font-medium">隊伍 A</h3>
        <div class="text-5xl font-bold my-3 text-gray-800">{{ teamAScore }}</div>
        <div class="flex justify-center gap-2">
          <button class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition" @click="addScore('A', 1)">+1</button>
          <button class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition" @click="addScore('A', 2)">+2</button>
          <button class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition" @click="addScore('A', 3)">+3</button>
        </div>
      </div>
      <div class="flex-1 text-center p-4 bg-white rounded-lg shadow">
        <h3 class="mt-0 text-gray-700 font-medium">隊伍 B</h3>
        <div class="text-5xl font-bold my-3 text-gray-800">{{ teamBScore }}</div>
        <div class="flex justify-center gap-2">
          <button class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition" @click="addScore('B', 1)">+1</button>
          <button class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition" @click="addScore('B', 2)">+2</button>
          <button class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition" @click="addScore('B', 3)">+3</button>
        </div>
      </div>
    </div>
    <button class="block mx-auto mt-5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition" @click="resetScores">重置分數</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const teamAScore = ref(0)
const teamBScore = ref(0)

const addScore = (team, points) => {
  if (team === 'A') {
    teamAScore.value += points
  } else if (team === 'B') {
    teamBScore.value += points
  }
}

const resetScores = () => {
  teamAScore.value = 0
  teamBScore.value = 0
}
</script>
