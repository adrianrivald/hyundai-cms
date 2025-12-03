import { useState, useEffect, useCallback } from "react";
import {
  offlineStorage,
  NetworkManager,
  SyncManager,
  type OfflineVisitor,
} from "@/lib/offline-storage";

export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(
    NetworkManager.getInstance().isConnected()
  );
  const [offlineVisitors, setOfflineVisitors] = useState<OfflineVisitor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const networkManager = NetworkManager.getInstance();
    const unsubscribe = networkManager.addListener(setIsOnline);

    // Load offline visitors on mount
    loadOfflineVisitors();

    return unsubscribe;
  }, []);

  // Sync when coming back online
  useEffect(() => {
    if (isOnline) {
      const syncManager = SyncManager.getInstance();
      syncManager.syncOfflineData().then(() => {
        loadOfflineVisitors(); // Refresh the list after sync
      });
    }
  }, [isOnline]);

  const loadOfflineVisitors = useCallback(async () => {
    try {
      setIsLoading(true);
      const visitors = await offlineStorage.getVisitors();
      setOfflineVisitors(visitors);
    } catch (error) {
      console.error("Failed to load offline visitors:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addOfflineVisitor = useCallback(
    async (
      visitorData: Omit<OfflineVisitor, "id" | "synced" | "created_at">
    ) => {
      try {
        const id = await offlineStorage.addVisitor(visitorData);
        await loadOfflineVisitors();
        return id;
      } catch (error) {
        console.error("Failed to add offline visitor:", error);
        throw error;
      }
    },
    [loadOfflineVisitors]
  );

  const updateOfflineVisitor = useCallback(
    async (id: string, updates: Partial<OfflineVisitor>) => {
      try {
        await offlineStorage.updateVisitor(id, updates);
        await loadOfflineVisitors();
      } catch (error) {
        console.error("Failed to update offline visitor:", error);
        throw error;
      }
    },
    [loadOfflineVisitors]
  );

  const deleteOfflineVisitor = useCallback(
    async (id: string) => {
      try {
        await offlineStorage.deleteVisitor(id);
        await loadOfflineVisitors();
      } catch (error) {
        console.error("Failed to delete offline visitor:", error);
        throw error;
      }
    },
    [loadOfflineVisitors]
  );

  const syncOfflineData = useCallback(async () => {
    if (!isOnline) {
      throw new Error("Cannot sync while offline");
    }

    try {
      const syncManager = SyncManager.getInstance();
      await syncManager.syncOfflineData();
      await loadOfflineVisitors();
    } catch (error) {
      console.error("Failed to sync offline data:", error);
      throw error;
    }
  }, [isOnline, loadOfflineVisitors]);

  return {
    isOnline,
    offlineVisitors,
    isLoading,
    addOfflineVisitor,
    updateOfflineVisitor,
    deleteOfflineVisitor,
    syncOfflineData,
    loadOfflineVisitors,
  };
}

// Hook for handling API calls with offline fallback
export function useOfflineAPI<T>(
  apiCall: () => Promise<T>,
  offlineFallback?: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isOnline } = useOfflineMode();

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let result: T;

      if (isOnline) {
        result = await apiCall();
      } else if (offlineFallback) {
        result = await offlineFallback();
      } else {
        throw new Error("No offline fallback available");
      }

      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, apiCall, offlineFallback, ...dependencies]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, isLoading, error, refetch: execute };
}
