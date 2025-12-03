// Offline storage utilities for visitor data
// Uses IndexedDB for persistent offline storage

const DB_NAME = "HyundaiQRDB";
const DB_VERSION = 1;
const STORE_NAME = "visitors";

export interface OfflineVisitor {
  id: string;
  name: string;
  dob: string;
  phone_number: string;
  email: string;
  sex: string;
  is_special_need: boolean;
  tour_number: string;
  verification_code?: string;
  attended_at?: string;
  synced: boolean;
  created_at: string;
}

class OfflineStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("synced", "synced", { unique: false });
          store.createIndex("created_at", "created_at", { unique: false });
        }
      };
    });
  }

  async addVisitor(
    visitor: Omit<OfflineVisitor, "id" | "synced" | "created_at">
  ): Promise<string> {
    if (!this.db) {
      await this.init();
    }

    const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const visitorData: OfflineVisitor = {
      ...visitor,
      id,
      synced: false,
      created_at: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(visitorData);

      request.onsuccess = () => {
        resolve(id);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getVisitors(): Promise<OfflineVisitor[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getUnsyncedVisitors(): Promise<OfflineVisitor[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("synced");
      const request = index.getAll(IDBKeyRange.only(false));

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async markVisitorAsSynced(id: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const visitor = getRequest.result;
        if (visitor) {
          visitor.synced = true;
          const putRequest = store.put(visitor);

          putRequest.onsuccess = () => {
            resolve();
          };

          putRequest.onerror = () => {
            reject(putRequest.error);
          };
        } else {
          reject(new Error("Visitor not found"));
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  }

  async deleteVisitor(id: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async updateVisitor(
    id: string,
    updates: Partial<OfflineVisitor>
  ): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const visitor = getRequest.result;
        if (visitor) {
          const updatedVisitor = { ...visitor, ...updates };
          const putRequest = store.put(updatedVisitor);

          putRequest.onsuccess = () => {
            resolve();
          };

          putRequest.onerror = () => {
            reject(putRequest.error);
          };
        } else {
          reject(new Error("Visitor not found"));
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  }

  async clearAllVisitors(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}

// Create singleton instance
export const offlineStorage = new OfflineStorage();

// Network status utilities
export class NetworkManager {
  private static instance: NetworkManager;
  private isOnline: boolean = navigator.onLine;
  private listeners: ((isOnline: boolean) => void)[] = [];

  constructor() {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.notifyListeners();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  isConnected(): boolean {
    return this.isOnline;
  }

  addListener(callback: (isOnline: boolean) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.isOnline));
  }
}

// Sync manager for handling offline data synchronization
export class SyncManager {
  private static instance: SyncManager;
  private isSyncing: boolean = false;

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  async syncOfflineData(): Promise<void> {
    if (this.isSyncing) {
      return;
    }

    this.isSyncing = true;

    try {
      const unsyncedVisitors = await offlineStorage.getUnsyncedVisitors();

      for (const visitor of unsyncedVisitors) {
        try {
          await this.syncVisitor(visitor);
          await offlineStorage.markVisitorAsSynced(visitor.id);
        } catch (error) {
          console.error("Failed to sync visitor:", visitor.id, error);
        }
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncVisitor(visitor: OfflineVisitor): Promise<void> {
    // This would make the actual API call to sync the visitor
    // For now, we'll simulate the API call
    const response = await fetch("/api/admin/participants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: visitor.name,
        dob: visitor.dob,
        phone_number: visitor.phone_number,
        email: visitor.email,
        sex: visitor.sex,
        is_special_need: visitor.is_special_need,
        tour_number: visitor.tour_number,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync visitor");
    }
  }
}
