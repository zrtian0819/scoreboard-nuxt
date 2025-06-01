<template>
  <div
    id="app"
    class="w-[100dvw] h-[100dvh] bg-green flex p-8 overflow-hidden relative no-double-tap-zoom"
  >
    <div class="grid grid-cols-2 text-white w-full h- full border-white border-8">
      <div class="border-white border-r-4 flex flex-col justify-center items-center gap-6 relative">
        <!-- <span
          class="absolute right-5 top-[50%] -translate-y-[50%] flex items-center justify-center cursor-pointer"
          @click="switchPlace('A')"
        >
          <MoveVertical class="w-10 h-10" />
        </span> -->
        <div class="flex text-4xl">
          <span v-show="currentTeam === 'A' && teamA.score % 2 !== 0">🏸</span>
          {{ teamA.oddPlace }}
        </div>

        <span v-show="winTeam === 'A'" class="absolute top-5 text-5xl animate-bounce">👑</span>
        <div
          class="bg-green px-2 text-[12dvw] flex flex-row items-center cursor-pointer select-none"
          @click="getScore('A')"
        >
          {{ teamA.score }}
        </div>
        <div class="flex text-4xl">
          <span v-show="currentTeam === 'A' && teamA.score % 2 == 0">🏸</span>
          {{ teamA.evenPlace }}
        </div>
      </div>
      <div class="border-white border-l-4 flex flex-col justify-center items-center gap-6 relative">
        <!-- <span
          class="absolute left-5 top-[50%] -translate-y-[50%] flex items-center justify-center cursor-pointer"
          @click="switchPlace('B')"
        >
          <MoveVertical class="w-10 h-10" />
        </span> -->
        <div class="flex text-4xl">
          <span v-show="currentTeam === 'B' && teamB.score % 2 == 0">🏸</span>
          {{ teamB.evenPlace }}
        </div>

        <span v-show="winTeam === 'B'" class="absolute top-5 text-5xl animate-bounce">👑</span>
        <div
          class="bg-green px-2 text-[12dvw] flex flex-row items-center cursor-pointer select-none"
          @click="getScore('B')"
        >
          {{ teamB.score }}
        </div>
        <div class="flex text-4xl">
          <span v-show="currentTeam === 'B' && teamB.score % 2 !== 0">🏸</span>
          {{ teamB.oddPlace }}
        </div>
      </div>
    </div>

    <nav
      class="absolute bottom-0 transition-all duration-700 left-0 font-bold"
      :class="[isSettingOpen ? 'bottom-0' : 'translate-y-[80dvh] sm:translate-y-[50dvh]']"
    >
      <div
        class="inline-block rounded-t-md sm:rounded-t-xl px-5 py-1 relative left-[50%] -translate-x-[50%] bg-white click transition duration-1000 delay-100"
        :class="{ 'opacity-40': !isSettingOpen }"
        @click="isSettingOpen = !isSettingOpen"
      >
        設定
      </div>
      <div
        class="bg-white px-5 py-10 sm:p-8 rounded-t-[10px] sm:rounded-t-[20px] w-screen shadow-sm h-[80dvh] sm:h-[50dvh] flex flex-col gap-5 overflow-auto"
      >
        <div class="flex items-center gap-4">
          <span class="m-auto flex items-center gap-2">
            <label for="score">最高分</label>
            <select v-model="maxScore" placeholder="請選擇" :disabled="gameIsStart">
              <option v-for="score in scoreOptions" :key="score" :value="score">{{ score }}</option>
            </select>
          </span>
          <span class="m-auto flex items-center gap-2">
            <label for="score">單雙打</label>
            <select v-model="playerPerTeam" placeholder="請選擇" :disabled="gameIsStart">
              >
              <option value="1">單打</option>
              <option value="2">雙打</option>
            </select>
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div class="flex flex-col gap-3 sm:border-r-1 border-neutral-300">
            <h2 class="text-xl">隊A</h2>
            <div class="flex">
              <label for="" class="flex-1">選手1</label>
              <input v-model="teamA.playerA" type="text" class="flex-2" />
            </div>
            <div class="flex">
              <label for="" class="flex-1">選手2</label>
              <input
                v-model="teamA.playerB"
                type="text"
                class="flex-2"
                :disabled="playerPerTeam === '1'"
              />
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <h2 class="text-xl">隊B</h2>
            <div class="flex">
              <label for="" class="flex-1">選手1</label>
              <input v-model="teamB.playerA" type="text" class="flex-2" />
            </div>
            <div class="flex">
              <label for="" class="flex-1">選手2</label>
              <input
                v-model="teamB.playerB"
                type="text"
                class="flex-2"
                :disabled="playerPerTeam === '1'"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 font-bold">
          <!-- :class="gameIsStart ? '' : 'outline'" -->
          <button @click="gameIsStart ? EndGame() : initGame()">
            {{ gameIsStart ? '結束' : '開始' }}
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { MoveVertical } from 'lucide-vue-next'

const isSettingOpen = ref(true)
const gameIsStart = ref(false)
const maxScore = ref(21)
const playerPerTeam = ref('2')
const lastGetScoreTeam = ref<team>(undefined)
const currentTeam = ref<team>(undefined)
const winTeam = ref<team>(undefined)
// 定義得分選項
const scoreOptions = ref([11, 21, 25])

type team = 'A' | 'B' | undefined

// reactive 用於物件類型
const initTeamObj = {
  msg: 0,
  playerA: '',
  playerB: '',
  evenPlace: '',
  oddPlace: '',
  score: 0,
}

const teamA = reactive({ ...initTeamObj })
const teamB = reactive({ ...initTeamObj })

// 方法
const initGame = () => {
  // 重設頁面縮放比例
  // document.documentElement.style.zoom = '1'

  // const viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement
  // console.log(viewport)
  // if (viewport) {
  //   viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
  // }

  isSettingOpen.value = true
  lastGetScoreTeam.value = undefined
  currentTeam.value = undefined
  winTeam.value = undefined

  teamA.score = 0
  teamB.score = 0
  teamA.evenPlace = ''
  teamA.oddPlace = ''
  teamB.evenPlace = ''
  teamB.oddPlace = ''

  randomStart()
}

const EndGame = () => {
  gameIsStart.value = false
  // Reset teams
  // Object.assign(teamA, { ...initTeamObj })
  // Object.assign(teamB, { ...initTeamObj })

  alert('比賽已結束，請重新設定！')
}

const startValidation = () => {
  if (!teamA.playerA || !teamB.playerA) {
    return alert('請輸入選手姓名')
  }
  if (playerPerTeam.value === '2' && (!teamA.playerB || !teamB.playerB)) {
    return alert('請輸入雙打選手姓名')
  }
  if (maxScore.value < 11 || maxScore.value > 25) {
    return alert('最高分數必須在11到25之間')
  }
  return true
}

const randomStart = () => {
  if (!startValidation()) return

  // Reset team A and B values
  Object.assign(teamA, {
    score: 0,
    playerA: teamA.playerA, // Preserve player names
    playerB: teamA.playerB, // Preserve player names
    evenPlace: '',
    oddPlace: '',
  })

  Object.assign(teamB, {
    score: 0,
    playerA: teamB.playerA, // Preserve player names
    playerB: teamB.playerB, // Preserve player names
    evenPlace: '',
    oddPlace: '',
  })

  const randomNum = Math.floor(Math.random() * 2)
  if (randomNum === 0) {
    currentTeam.value = 'A'
    lastGetScoreTeam.value = 'A'
    teamA.evenPlace = teamA.playerA
    teamB.evenPlace = teamB.playerA
    if (playerPerTeam.value === '2') {
      teamA.oddPlace = teamA.playerB
      teamB.oddPlace = teamB.playerB
    }
  } else {
    currentTeam.value = 'B'
    lastGetScoreTeam.value = 'B'
    teamA.evenPlace = teamA.playerA
    teamB.evenPlace = teamB.playerA
    if (playerPerTeam.value === '2') {
      teamA.oddPlace = teamA.playerB
      teamB.oddPlace = teamB.playerB
    }
  }

  gameIsStart.value = true
  isSettingOpen.value = false
  alert('已經分配好先發球隊伍！請開始比賽!')
}

const switchPlace = (team: team) => {
  if (!gameIsStart.value) return alert('請先開始比賽')
  if (!team) return console.error('team is undefined')
  if (team === 'A') {
    const originEvenPlayer = teamA.evenPlace
    const originOddPlayer = teamA.oddPlace
    teamA.evenPlace = originOddPlayer
    teamA.oddPlace = originEvenPlayer
  } else {
    const originEvenPlayer = teamB.evenPlace
    const originOddPlayer = teamB.oddPlace
    teamB.evenPlace = originOddPlayer
    teamB.oddPlace = originEvenPlayer
  }
}

const getScore = (team: team) => {
  if (!gameIsStart.value) return alert('請先開始比賽')

  // 站位邏輯
  // if (team === 'A') {
  //   teamA.score++
  //   currentTeam.value = 'A'
  //   if (playerPerTeam.value === '2') {
  //     switchPlace('A')
  //   }
  //   if (playerPerTeam.value === '1') {
  //     console.log(teamA, teamB)
  //     if (teamA.evenPlace !== '' && teamB.evenPlace === '') {
  //       switchPlace('B')
  //     }
  //     if (teamA.oddPlace !== '' && teamB.oddPlace === '') {
  //       switchPlace('B')
  //     }
  //   }
  //   lastGetScoreTeam.value = 'A'
  // } else {
  //   teamB.score++
  //   currentTeam.value = 'B'
  //   if (playerPerTeam.value === '2') {
  //     switchPlace('B')
  //   }
  //   if (playerPerTeam.value === '1') {
  //     console.log(teamA, teamB)
  //     if (teamB.evenPlace !== '' && teamA.evenPlace === '') {
  //       switchPlace('A')
  //     }
  //     if (teamB.oddPlace !== '' && teamA.oddPlace === '') {
  //       switchPlace('A')
  //     }
  //   }
  //   lastGetScoreTeam.value = 'B'
  // }

  // const currentGetScoreTeam = team === 'A' ? 'A' : 'B';

  if (playerPerTeam.value === '1') {
    let currentScoreIsEven

    if (team === 'A') {
      teamA.score++
      currentTeam.value = 'A'
      lastGetScoreTeam.value = 'A'
      currentScoreIsEven = isEven(teamA.score)
    } else {
      teamB.score++
      currentTeam.value = 'B'
      lastGetScoreTeam.value = 'B'
      currentScoreIsEven = isEven(teamB.score)
    }

    if (currentScoreIsEven) {
      teamA.evenPlace = teamA.playerA
      teamA.oddPlace = ''
      teamB.evenPlace = teamB.playerA
      teamB.oddPlace = ''
    } else {
      teamA.oddPlace = teamA.playerA
      teamA.evenPlace = ''
      teamB.oddPlace = teamB.playerA
      teamB.evenPlace = ''
    }
  } else if (playerPerTeam.value === '2') {
    if (team === 'A') {
      teamA.score++
      currentTeam.value = 'A'
      lastGetScoreTeam.value = 'A'
      switchPlace('A')
    } else {
      teamB.score++
      currentTeam.value = 'B'
      lastGetScoreTeam.value = 'B'
      switchPlace('B')
    }
  }

  if (teamA.score >= Number(maxScore.value) && teamA.score - teamB.score >= 2) {
    alert(`${teamA.playerA} & ${teamA.playerB} 贏了！`)
    winTeam.value = 'A'
    gameIsStart.value = false
    // initGame()
  } else if (teamB.score >= Number(maxScore.value) && teamB.score - teamA.score >= 2) {
    alert(`${teamB.playerA} & ${teamB.playerB} 贏了！`)
    winTeam.value = 'B'
    gameIsStart.value = false
    // initGame()
  } else if (
    teamA.score >= Number(maxScore.value) - 1 &&
    teamB.score >= Number(maxScore.value) - 1
  ) {
    alert('Deuce! 雙方進入延長賽，需領先2分才可獲勝！')
  }
}

// 禁止雙擊放大   //暫時先取消😢
// onMounted(() => {
//   document.addEventListener(
//     'touchstart',
//     function (event) {
//       if (event.touches.length > 1) {
//         event.preventDefault()
//       }
//     },
//     { passive: false }
//   )

//   let lastTouchEnd = 0
//   document.addEventListener(
//     'touchend',
//     function (event) {
//       const now = new Date().getTime()
//       if (now - lastTouchEnd <= 300) {
//         event.preventDefault()
//       }
//       lastTouchEnd = now
//     },
//     { passive: false }
//   )
// })

const isEven = (num: number) => {
  return num % 2 === 0
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap');
$green: #016934;

html {
  font-family: 'Noto Sans TC', sans-serif;
}

.bg-green {
  background-color: $green;
}

.click {
  cursor: pointer;
}

.test {
  border: 1px solid black;
  & * {
    border: 1px solid black;
  }
}

input {
  border: 2px solid $green;
  border-radius: 5px;
  max-width: 250px;
  padding: 8px 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:focus {
    border: 2px solid $green;
    box-shadow: 0 0 0 3px rgba($green, 0.3);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }

  &:disabled {
    background-color: #f5f5f5;
    border-color: #e0e0e0;
    color: #888888;
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: none;
    transform: none;

    &::placeholder {
      color: rgba(0, 0, 0, 0.2);
    }
  }
}

select {
  border: 2px solid $green;
  border-radius: 5px;
  max-width: 250px;
  padding: 8px 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  appearance: none; // Removes default browser styling
  background-color: white;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a 1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px; // Space for the custom arrow

  &:focus {
    border: 2px solid $green;
    box-shadow: 0 0 0 3px rgba($green, 0.3);
    transform: translateY(-1px);
  }

  &:hover {
    cursor: pointer;
  }

  // Styling for option elements
  option {
    padding: 8px;
    font-size: 14px;
  }
}

button {
  border: 2px solid $green;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: $green;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    // background-color: darken($green, 5%);
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba($green, 0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  }

  // Secondary/outline variant
  &.outline {
    background-color: transparent;
    color: $green;

    &:hover {
      background-color: rgba($green, 0.1);
    }
  }

  // Disabled state
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;

    &:hover {
      background-color: $green;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }
}

// 禁止雙擊放大
.no-double-tap-zoom {
  touch-action: manipulation;
}

* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

// Custom Scrollbar with Inset Design
// Designed for: zrtian0819
// Created: 2025-04-27

// Custom Scrollbar with Inset Design
// Designed for: zrtian0819
// Created: 2025-04-27

// Hide default buttons/arrows
::-webkit-scrollbar-button {
  display: none;
}

// Main scrollbar container - making it more inset
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  margin-right: 4px;
}

// Track (background) - more inset with transparency
::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: content-box;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.08);
  margin: 4px;
}

// Thumb (the draggable part) - using $green with transparency
::-webkit-scrollbar-thumb {
  background-color: rgba($green, 0.6);
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: content-box;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba($green, 0.8);
  }

  &:active {
    background-color: rgba($green, 1);
  }
}

// Corner where horizontal and vertical scrollbars meet
::-webkit-scrollbar-corner {
  background: transparent;
}

// For Firefox (different syntax)
* {
  scrollbar-width: thin;
  scrollbar-color: rgba($green, 0.6) transparent;
}

// Optional: Additional inset for specific containers
.inset-scrollbar {
  padding-right: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.12);
    margin: 6px;
  }
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

// label{
//   min-width: 100px;
// }
</style>
