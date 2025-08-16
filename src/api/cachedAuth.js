import axios from "axios"
import cacheManager from "../utils/cacheManager"

const API = axios.create({
  baseURL: "https://backend-164859304804.us-central1.run.app",
  headers: {
    "Content-Type": "application/json",
  },
})

// Enhanced API methods with caching
const cachedAPI = {
  // Original axios instance for non-cached requests
  ...API,

  // Cached GET request
  async getCached(url, config = {}) {
    const cacheKey = cacheManager.generateKey("api", { url, params: config.params })

    // Check cache first
    const cachedData = cacheManager.get(cacheKey)
    if (cachedData) {
      console.log(`[Cache Hit] ${url}`)
      return { data: cachedData, fromCache: true }
    }

    try {
      console.log(`[Cache Miss] ${url}`)
      const response = await API.get(url, config)

      // Cache the response
      cacheManager.set(cacheKey, response.data)

      return { ...response, fromCache: false }
    } catch (error) {
      throw error
    }
  },

  // Cached lessons fetch
  async getLessons(params) {
    const cachedData = cacheManager.getCachedLessons(params)
    if (cachedData) {
      console.log("[Cache Hit] Lessons data")
      return { data: cachedData, fromCache: true }
    }

    try {
      console.log("[Cache Miss] Lessons data")
      const response = await API.get("/v1/teacherResource/lessons", { params })
      cacheManager.cacheLessons(params, response.data)
      return { ...response, fromCache: false }
    } catch (error) {
      throw error
    }
  },

  // Cached topics fetch
  async getTopics(params) {
    const cachedData = cacheManager.getCachedTopics(params)
    if (cachedData) {
      console.log("[Cache Hit] Topics data")
      return { data: cachedData, fromCache: true }
    }

    try {
      console.log("[Cache Miss] Topics data")
      const response = await API.get("/v1/teacherResource/topics/search", { params })
      cacheManager.cacheTopics(params, response.data)
      return { ...response, fromCache: false }
    } catch (error) {
      throw error
    }
  },

  // Cached topic details fetch
  async getTopicDetails(topicId) {
    const cachedData = cacheManager.getCachedTopicDetails(topicId)
    if (cachedData) {
      console.log("[Cache Hit] Topic details")
      return { data: cachedData, fromCache: true }
    }

    try {
      console.log("[Cache Miss] Topic details")
      const response = await API.get(`/v1/teacherResource/topic/${topicId}`)
      cacheManager.cacheTopicDetails(topicId, response.data)
      return { ...response, fromCache: false }
    } catch (error) {
      throw error
    }
  },

  // Cached curricula fetch
  async getCurricula() {
    const cachedData = cacheManager.getCachedFilters("curricula")
    if (cachedData) {
      console.log("[Cache Hit] Curricula data")
      return { data: cachedData, fromCache: true }
    }

    try {
      console.log("[Cache Miss] Curricula data")
      const response = await API.get("/v1/teacherResource/curricula")
      cacheManager.cacheFilters("curricula", response.data)
      return { ...response, fromCache: false }
    } catch (error) {
      throw error
    }
  },

  // Cached grades fetch
  async getGrades() {
    const cachedData = cacheManager.getCachedFilters("grades")
    if (cachedData) {
      console.log("[Cache Hit] Grades data")
      return { data: cachedData, fromCache: true }
    }

    try {
      console.log("[Cache Miss] Grades data")
      const response = await API.get("/v1/teacherResource/grades")
      cacheManager.cacheFilters("grades", response.data)
      return { ...response, fromCache: false }
    } catch (error) {
      throw error
    }
  },

  // Cached PDF fetch
  async getPDF(url) {
    // Check if PDF is already cached
    const cachedPDF = cacheManager.getCachedPDF(url)
    if (cachedPDF) {
      console.log("[Cache Hit] PDF data")
      return { data: cachedPDF, fromCache: true }
    }

    try {
      console.log("[Cache Miss] PDF data")
      const response = await fetch(url)
      const pdfBlob = await response.blob()

      // Cache the PDF
      await cacheManager.cachePDF(url, pdfBlob)

      return { data: pdfBlob, fromCache: false }
    } catch (error) {
      throw error
    }
  },

  // Get cached page image
  getCachedPageImage(cacheKey) {
    return cacheManager.get(`page_image_${cacheKey}`)
  },

  // Set cached page image
  setCachedPageImage(cacheKey, imageUrl) {
    cacheManager.set(`page_image_${cacheKey}`, imageUrl)
    console.log(`[Cache Set] Page image: ${cacheKey}`)
  },

  // Clear cached page images for a specific PDF
  clearPDFPageCache(pdfFingerprint) {
    const keys = cacheManager.getAllKeys()
    keys.forEach((key) => {
      if (key.includes(`page_image_page_${pdfFingerprint}_`)) {
        cacheManager.remove(key)
      }
    })
    console.log(`[Cache Clear] PDF page images for: ${pdfFingerprint}`)
  },

  // Clear all cache
  clearCache() {
    cacheManager.clear()
    console.log("All cache cleared")
  },

  // Get cache statistics
  getCacheStats() {
    return cacheManager.getStats()
  },
}

export default cachedAPI
