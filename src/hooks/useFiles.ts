import { useFetch } from './useFetch'

export const useFiles = () => {
  const getIndexStyle = async (): Promise<string | null> => {
    const { data } = await useFetch('//unpkg.com/element-plus/lib/theme-chalk/index.css')
    return data
  }

  return {
    getIndexStyle
  }
}
