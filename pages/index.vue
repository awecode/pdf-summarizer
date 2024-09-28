<template>
  <div>
    <h1>PDF Summarizer</h1>
    <form @submit.prevent="uploadFile">
      <input
        ref="fileInput"
        type="file"
        accept=".pdf"
        required
      >
      <button type="submit">
        Upload and Summarize
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

const uploadFile = async () => {
  const file = fileInput.value.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('pdf', file)

  try {
    const response = await $fetch('/api/summarize', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload and summarize the PDF')
    }

    const data = await response.json()
    summary.value = data.response.result.response
    error.value = ''
  }
  catch (err) {
    console.error(err)
    error.value = 'An error occurred while processing the PDF'
    summary.value = ''
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
