<template>
  <div class="container">
    <h1>PDF Summarizer</h1>
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
  </div>
</template>

<script setup>
const fileInput = ref(null)
const summary = ref('')
const error = ref('')
const isLoading = ref(false)

const uploadFile = async () => {
  const file = fileInput.value.files[0]
  if (!file) return

  isLoading.value = true
  error.value = ''
  summary.value = ''

  const formData = new FormData()
  formData.append('pdf', file)

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
.container{
    padding: 2em !important;
}
</style>
