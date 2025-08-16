class CacheManager {
  constructor() {
    this.cache = new Map()
    this.cacheExpiry = new Map()
    this.defaultTTL = 30 * 60 * 1000 // 30 minutes default TTL
    this.pdfTTL = 24 * 60 * 60 * 1000 // 24 hours for PDFs
    this.lessonTTL = 60 * 60 * 1000 // 1 hour for lessons/topics
  }

  // Generate cache key
  generateKey(type, params) {
    if (typeof params === "object") {
      return `${type}_${JSON.stringify(params)}`
    }
    return `${type}_${params}`
  }

  // Set cache with TTL
  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, data)
    this.cacheExpiry.set(key, Date.now() + ttl)

    // Store in localStorage for persistence
    try {
      const cacheData = {
        data,
        expiry: Date.now() + ttl,
        timestamp: Date.now(),
      }
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData))
    } catch (error) {
      console.warn("Failed to store in localStorage:", error)
    }
  }

  // Get from cache
  get(key) {
    // Check memory cache first
    if (this.cache.has(key)) {
      const expiry = this.cacheExpiry.get(key)
      if (Date.now() < expiry) {
        return this.cache.get(key)
      } else {
        // Expired, remove from memory
        this.cache.delete(key)
        this.cacheExpiry.delete(key)
      }
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem(`cache_${key}`)
      if (stored) {
        const cacheData = JSON.parse(stored)
        if (Date.now() < cacheData.expiry) {
          // Restore to memory cache
          this.cache.set(key, cacheData.data)
          this.cacheExpiry.set(key, cacheData.expiry)
          return cacheData.data
        } else {
          // Expired, remove from localStorage
          localStorage.removeItem(`cache_${key}`)
        }
      }
    } catch (error) {
      console.warn("Failed to retrieve from localStorage:", error)
    }

    return null
  }

  // Check if key exists and is valid
  has(key) {
    return this.get(key) !== null
  }

  // Clear specific cache
  delete(key) {
    this.cache.delete(key)
    this.cacheExpiry.delete(key)
    localStorage.removeItem(`cache_${key}`)
  }

  // Clear all cache
  clear() {
    this.cache.clear()
    this.cacheExpiry.clear()

    // Clear localStorage cache entries
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith("cache_")) {
        localStorage.removeItem(key)
      }
    })
  }

  // Cache PDF blob data
  async cachePDF(url, pdfBlob) {
    const key = this.generateKey("pdf", url)

    try {
      // Convert blob to base64 for storage
      const reader = new FileReader()
      return new Promise((resolve) => {
        reader.onload = () => {
          const base64Data = reader.result
          this.set(key, base64Data, this.pdfTTL)
          resolve(base64Data)
        }
        reader.readAsDataURL(pdfBlob)
      })
    } catch (error) {
      console.warn("Failed to cache PDF:", error)
      return null
    }
  }

  // Get cached PDF
  getCachedPDF(url) {
    const key = this.generateKey("pdf", url)
    const cachedData = this.get(key)

    if (cachedData) {
      try {
        // Convert base64 back to blob
        const byteCharacters = atob(cachedData.split(",")[1])
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        return new Blob([byteArray], { type: "application/pdf" })
      } catch (error) {
        console.warn("Failed to convert cached PDF:", error)
        this.delete(key)
        return null
      }
    }

    return null
  }

  // Cache lessons data
  cacheLessons(params, data) {
    const key = this.generateKey("lessons", params)
    this.set(key, data, this.lessonTTL)
  }

  // Get cached lessons
  getCachedLessons(params) {
    const key = this.generateKey("lessons", params)
    return this.get(key)
  }

  // Cache topics data
  cacheTopics(params, data) {
    const key = this.generateKey("topics", params)
    this.set(key, data, this.lessonTTL)
  }

  // Get cached topics
  getCachedTopics(params) {
    const key = this.generateKey("topics", params)
    return this.get(key)
  }

  // Cache topic details
  cacheTopicDetails(topicId, data) {
    const key = this.generateKey("topic_details", topicId)
    this.set(key, data, this.lessonTTL)
  }

  // Get cached topic details
  getCachedTopicDetails(topicId) {
    const key = this.generateKey("topic_details", topicId)
    return this.get(key)
  }

  // Cache curricula and grades
  cacheFilters(type, data) {
    const key = this.generateKey("filters", type)
    this.set(key, data, this.lessonTTL)
  }

  // Get cached filters
  getCachedFilters(type) {
    const key = this.generateKey("filters", type)
    return this.get(key)
  }

  // Get cache statistics
  getStats() {
    return {
      memoryEntries: this.cache.size,
      localStorageEntries: Object.keys(localStorage).filter((key) => key.startsWith("cache_")).length,
      totalSize: this.calculateCacheSize(),
    }
  }

  // Calculate approximate cache size
  calculateCacheSize() {
    let size = 0
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith("cache_")) {
          size += localStorage.getItem(key).length
        }
      })
    } catch (error) {
      console.warn("Failed to calculate cache size:", error)
    }
    return size
  }
}

// Create singleton instance
const cacheManager = new CacheManager()
export default cacheManager
