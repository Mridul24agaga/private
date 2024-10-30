export interface SalesData {
    id?: number
    email: string
    chatterName: string
    timezone: string
    date: string
    modelsWorkedOn: string
    shiftTime: string
    wasItCover: string
    whoCovered: string
    totalNetSale: string
    pay?: number
    payPercentage: number
  }
  
  class DatabaseService {
    private dbName = 'SalesDB'
    private version = 1
    private storeName = 'chatterData'
  
    async init() {
      return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version)
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
        
        request.onupgradeneeded = (event) => {
          const db = request.result
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true })
          }
        }
      })
    }
  
    async getAllData(): Promise<SalesData[]> {
      const db = await this.init()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly')
        const store = transaction.objectStore(this.storeName)
        const request = store.getAll()
  
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(request.error)
      })
    }
  
    async saveData(data: Omit<SalesData, 'id'>): Promise<number> {
      const db = await this.init()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.add({ ...data, payPercentage: data.payPercentage || 7 })
        
        request.onsuccess = () => resolve(request.result as number)
        request.onerror = () => reject(request.error)
      })
    }
  
    async updateData(id: number, data: Partial<SalesData>): Promise<void> {
      const db = await this.init()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.get(id)
  
        request.onsuccess = () => {
          const updatedData = { ...request.result, ...data }
          const updateRequest = store.put(updatedData)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        }
        request.onerror = () => reject(request.error)
      })
    }
  
    async deleteData(id: number): Promise<void> {
      const db = await this.init()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.delete(id)
  
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }
  
    async clearAllData(): Promise<void> {
      const db = await this.init()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.clear()
  
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }
  
    async migrateFromLocalStorage(): Promise<void> {
      try {
        const existingData = localStorage.getItem('chatterData')
        if (existingData) {
          const data = JSON.parse(existingData)
          for (const item of data) {
            await this.saveData(item)
          }
          // Keep a backup
          localStorage.setItem('chatterData_backup', existingData)
          localStorage.removeItem('chatterData')
        }
      } catch (error) {
        console.error('Migration failed:', error)
        throw error
      }
    }
  }
  
  export const db = new DatabaseService()