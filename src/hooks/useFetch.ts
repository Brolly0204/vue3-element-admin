import { ref } from 'vue'

const useFetch = async (url: string, isBlob = false) => {
  const data = ref(null)
  const address = ref('')
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = isBlob ? 'blob' : ''
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return
      if (xhr.status === 200) {
        const urlArr = xhr.responseURL.split('/')
        resolve({
          data: data.value = xhr.response,
          url: address.value = urlArr[urlArr.length - 1]
        })
      } else {
        reject(new Error(xhr.statusText))
      }
    }
    xhr.open('GET', url)
    xhr.send()
  })
  return {
    data: data.value,
    url: address.value
  }
}

export { useFetch }
