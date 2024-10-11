<template>
  <div class="container">
    <div class="header">
      <h1>PDF Summarizer</h1>
      <div class="header-buttons">
        <a href="https://github.com/awecode/pdf-summarizer" target="_blank" rel="noopener noreferrer" class="header-button">
          GitHub
        </a>
        <button
          class="header-button"
          @click="toggleSettings"
        >
          ⚙️ Settings
        </button>
      </div>
    </div>
    <form @submit.prevent="uploadFile">
      <input
        ref="fileInput"
        type="file"
        accept=".pdf"
        required
        :disabled="isLoading || showSettings"
      >
      <button
        type="submit"
        :disabled="isLoading || showSettings"
      >
        {{ isLoading ? 'Processing...' : 'Upload and Summarize' }}
      </button>
    </form>
    <div v-if="summaries.length > 0">
      <h2>{{ summaries.length === 1 ? 'Summary' : 'Summaries' }}</h2>
      <div
        v-for="(sum, index) in summaries"
        :key="index"
      >
        <h3>{{ sum.fileName }}</h3>
        <p v-if="sum.content">
          {{ sum.content }}
        </p>
        <p
          v-else
          class="warning"
        >
          Warning: The summary is empty. You may have uploaded a file that exceeds the model's input length. Please
          reduce the input context length from settings and try again.
        </p>
        <hr v-if="index < summaries.length - 1">
      </div>
    </div>
    <div v-if="error">
      <p class="error">
        {{ error }}
      </p>
    </div>
    <div
      v-if="showSettings"
      class="settings-popup"
      @click.self="toggleSettings"
    >
      <div class="settings-content">
        <h2>Settings</h2>
        <label>
          AI Model
          <select v-model="aiModel">
            <option value="@cf/meta/llama-3.1-70b-instruct">
              Llama 3.1 70B Instruct
            </option>
            <option value="@cf/meta/llama-2-7b-chat-int8">Llama 2 7B Chat</option>
            <option value="@cf/mistral/mistral-7b-instruct-v0.1">Mistral 7B Instruct v0.1</option>
            <option value="@cf/mistral/mistral-7b-instruct-v0.2">Mistral 7B Instruct v0.2</option>
            <option value="@hf/thebloke/mistral-7b-instruct-v0.1-awq">Mistral 7B Instruct v0.1 AWQ</option>
            <option value="@cf/google/gemma-7b-it-lora">Gemma 7B IT LoRA</option>
          </select>
        </label>
        <label>
          Max Context Length
          <input
            v-model="maxContextLength"
            type="number"
            min="1000"
            max="200000"
            step="1000"
          >
        </label>
        <button @click="saveSettings">
          Save
        </button>
        <button @click="toggleSettings">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const fileInput = ref(null)
const summaries = ref([])
const error = ref('')
const isLoading = ref(false)
const showSettings = ref(false)
const maxContextLength = ref(config.public.maxContextLength)
const aiModel = ref(config.public.cfWorkerAiModel)

onMounted(() => {
  // Load settings from local storage on component mount
  const savedSettings = localStorage.getItem('pdfSummarizerSettings')
  if (savedSettings) {
    const { maxContextLength: savedMaxContextLength, aiModel: savedAiModel } = JSON.parse(savedSettings)
    maxContextLength.value = savedMaxContextLength
    aiModel.value = savedAiModel
  }
})

const toggleSettings = () => {
  showSettings.value = !showSettings.value
  if (showSettings.value) {
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = 'auto'
  }
}

const saveSettings = () => {
  const settings = {
    maxContextLength: maxContextLength.value,
    aiModel: aiModel.value,
  }
  localStorage.setItem('pdfSummarizerSettings', JSON.stringify(settings))
  toggleSettings()
}

const uploadFile = async () => {
  const file = fileInput.value.files[0]
  if (!file) return

  isLoading.value = true
  error.value = ''

  const formData = new FormData()
  formData.append('pdf', file)
  formData.append('maxContextLength', maxContextLength.value)
  formData.append('aiModel', aiModel.value)

  try {
    const response = await $fetch('/api', {
      method: 'POST',
      body: formData,
    })

    if (!response) {
      throw new Error('Failed to upload and summarize the PDF')
    }

    summaries.value.unshift({
      fileName: file.name,
      content: response.result.response,
    })
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

.warning {
  color: orange;
}

.container {
  padding: 2em !important;
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3em;
  flex-wrap: wrap;
}

.header-buttons {
  display: flex;
  align-items: center;
}

.header-button {
  margin-right: 1em;
  text-decoration: none;
  color: #fff;
  background-color: #24292e;
  padding: 0.5em 1em;
  border-radius: 5px;
  font-size: 0.9em;
  flex-shrink: 0;
}

.settings-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.settings-content {
  background-color: #383e5f;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
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

input[type="file"] {
  width: auto;
}
</style>
