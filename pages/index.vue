<template>
  <div class="container">
    <h1>PDF Summarizer</h1>
    <button
      class="settings-button"
      @click="toggleSettings"
    >
      ⚙️ Settings
    </button>
    <form @submit.prevent="uploadFile">
      <input
        ref="fileInput"
        type="file"
        accept=".pdf"
        required
        :disabled="isLoading"
      >
      <button
        type="submit"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Processing...' : 'Upload and Summarize' }}
      </button>
    </form>
    <div v-if="summary">
      <h2>Summary:</h2>
      <p>{{ summary }}</p>
    </div>
    <div v-if="error">
      <p class="error">
        {{ error }}
      </p>
    </div>
    <div
      v-if="showSettings"
      class="settings-popup"
    >
      <h2>Settings</h2>
      <label>
        Max Context Length:
        <input
          v-model="maxContextLength"
          type="number"
          min="1000"
          max="200000"
          step="1000"
        >
      </label>
      <label>
        AI Model:
        <select v-model="aiModel">
          <option value="@cf/meta/llama-3.1-70b-instruct">
            Llama 3.1 70B Instruct
          </option>
          <option value="@cf/meta/llama-2-7b-chat-int8">Llama 2 7B Chat</option>
        </select>
      </label>
      <button @click="saveSettings">
        Save
      </button>
      <button @click="toggleSettings">
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
const fileInput = ref(null)
const summary = ref('')
const error = ref('')
const isLoading = ref(false)
const showSettings = ref(false)
const maxContextLength = ref(112000)
const aiModel = ref('@cf/meta/llama-3.1-70b-instruct')

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const saveSettings = () => {
  // Here you would typically save the settings to your backend or local storage
  console.log('Settings saved:', {
    maxContextLength: maxContextLength.value,
    aiModel: aiModel.value,
  })
  showSettings.value = false
}

const uploadFile = async () => {
  const file = fileInput.value.files[0]
  if (!file) return

  isLoading.value = true
  error.value = ''
  summary.value = ''

  const formData = new FormData()
  formData.append('pdf', file)
  formData.append('maxContextLength', maxContextLength.value)
  formData.append('aiModel', aiModel.value)

  try {
    const response = await $fetch('/api/summarize', {
      method: 'POST',
      body: formData,
    })

    if (!response) {
      throw new Error('Failed to upload and summarize the PDF')
    }

    summary.value = response.result.response
    error.value = ''
    fileInput.value.value = ''
  }
  catch (err) {
    console.error(err)
    error.value = 'An error occurred while processing the PDF'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.error {
  color: red;
}

.container {
  padding: 2em !important;
  position: relative;
}

.settings-button {
  position: absolute;
  top: 1em;
  right: 1em;
}

.settings-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.settings-popup label {
  display: block;
  margin-bottom: 1em;
}

.settings-popup input,
.settings-popup select {
  width: 100%;
  margin-top: 0.5em;
}

.settings-popup button {
  margin-right: 1em;
}
</style>
