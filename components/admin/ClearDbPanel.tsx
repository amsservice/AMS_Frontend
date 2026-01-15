"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Database,
  RefreshCw,
  Search,
  Trash2,
  FolderX,
  Skull,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import ConfirmDangerModal from "@/components/admin/ConfirmDangerModal";

type CollectionsResponse = {
  collections: string[];
  counts?: Record<string, number>;
};

type Props = {
  title?: string;
};

export default function ClearDbPanel({ title = "ClearDB" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<number | null>(null);

  const [confirmMode, setConfirmMode] = useState<
    null | "clear" | "dropCollections" | "dropDb"
  >(null);

  const selectedList = useMemo(
    () => Object.keys(selected).filter((k) => selected[k]),
    [selected]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return collections;
    return collections.filter((c) => c.toLowerCase().includes(q));
  }, [collections, query]);

  const allFilteredSelected = useMemo(() => {
    if (!filtered.length) return false;
    return filtered.every((c) => selected[c]);
  }, [filtered, selected]);

  const anySelected = selectedList.length > 0;

  const totalDocs = useMemo(() => {
    return Object.values(counts).reduce((acc, v) => acc + (v || 0), 0);
  }, [counts]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = (await adminFetch("/api/admin/db/collections")) as CollectionsResponse;
      setCollections(res.collections || []);
      setCounts(res.counts || {});
      setLastRefreshed(Date.now());

      setSelected((prev) => {
        const next: Record<string, boolean> = {};
        for (const name of res.collections || []) {
          next[name] = prev[name] || false;
        }
        return next;
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const startTime = Date.now();
    
    await fetchCollections();
    
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 500 - elapsedTime);
    
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }
    
    setRefreshing(false);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        await handleRefresh();
      } catch (e) {
        if (mounted) {
          toast.error(e instanceof Error ? e.message : "Failed to load collections");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleAllFiltered = () => {
    setSelected((prev) => {
      const next = { ...prev };
      for (const name of filtered) {
        next[name] = !allFilteredSelected;
      }
      return next;
    });
  };

  const clearSelected = async () => {
    const cols = selectedList;
    const promise = adminFetch("/api/admin/db/collections/clear", {
      method: "POST",
      body: JSON.stringify({ collections: cols }),
    }) as Promise<{ cleared: Record<string, number> }>;

    toast.promise(promise, {
      loading: "Clearing selected collections...",
      success: "Selected collections cleared",
      error: (err) => (err instanceof Error ? err.message : "Clear failed"),
    });

    await promise;
    await fetchCollections();
  };

  const dropSelectedCollections = async () => {
    const cols = selectedList;
    const promise = adminFetch("/api/admin/db/collections/drop", {
      method: "POST",
      body: JSON.stringify({ collections: cols }),
    }) as Promise<{ dropped: string[]; failed: Record<string, string> }>;

    toast.promise(promise, {
      loading: "Dropping selected collections...",
      success: "Selected collections dropped",
      error: (err) => (err instanceof Error ? err.message : "Drop failed"),
    });

    await promise;
    await fetchCollections();
  };

  const dropDatabase = async () => {
    const promise = adminFetch("/api/admin/db/database/drop", {
      method: "POST",
      body: JSON.stringify({ confirm: "DROP" }),
    }) as Promise<{ message: string }>;

    toast.promise(promise, {
      loading: "Dropping database...",
      success: "Database dropped",
      error: (err) => (err instanceof Error ? err.message : "Drop failed"),
    });

    await promise;
    await fetchCollections();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Manage collections safely. You can clear documents, drop collections, or drop the entire DB.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="bg-white/60 dark:bg-white/5"
              onClick={handleRefresh}
              disabled={refreshing}
              type="button"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              variant="destructive"
              onClick={() => setConfirmMode("dropDb")}
              disabled={loading}
              type="button"
            >
              <Skull className="w-4 h-4" />
              Drop DB
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/40"
          >
            <div className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
              Collections
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {collections.length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-2xl p-4 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-200/50 dark:border-purple-700/40"
          >
            <div className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
              Estimated docs
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {totalDocs}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/25 dark:to-orange-900/30 border border-amber-200/50 dark:border-amber-700/40"
          >
            <div className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
              Last refresh
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white mt-2">
              {lastRefreshed ? new Date(lastRefreshed).toLocaleString() : "-"}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl pl-11 pr-4 py-3 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search collections..."
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="bg-white/60 dark:bg-white/5"
              onClick={toggleAllFiltered}
              disabled={loading || filtered.length === 0}
              type="button"
            >
              {allFilteredSelected ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              Select all
            </Button>

            <Button
              variant="outline"
              className="bg-white/60 dark:bg-white/5"
              onClick={() => setConfirmMode("clear")}
              disabled={loading || !anySelected}
              type="button"
            >
              <Trash2 className="w-4 h-4" />
              Clear selected
            </Button>

            <Button
              variant="destructive"
              onClick={() => setConfirmMode("dropCollections")}
              disabled={loading || !anySelected}
              type="button"
            >
              <FolderX className="w-4 h-4" />
              Drop selected
            </Button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 bg-gray-50 dark:bg-gray-900/40 text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
            <div className="col-span-7">Collection</div>
            <div className="col-span-3">Estimated docs</div>
            <div className="col-span-2 text-right">Select</div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <div className="p-6 text-sm text-gray-600 dark:text-gray-300">Loading collections...</div>
            ) : filtered.length ? (
              filtered.map((name) => {
                const checked = !!selected[name];
                return (
                  <div
                    key={name}
                    onClick={() => router.push(`/admin/clear-db/${encodeURIComponent(name)}`)}
                    className="grid grid-cols-12 px-4 py-4 bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors cursor-pointer"
                  >
                    <div className="col-span-7 flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:from-purple-500/15 dark:to-blue-500/15 border border-purple-300/30 dark:border-purple-500/20 flex items-center justify-center">
                        <Database className="w-4 h-4 text-purple-700 dark:text-purple-300" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white truncate">
                          {name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {name}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center text-sm text-gray-700 dark:text-gray-200">
                      {counts[name] ?? 0}
                    </div>

                    <div className="col-span-2 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected((prev) => ({ ...prev, [name]: !prev[name] }));
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {checked ? (
                          <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-sm text-gray-600 dark:text-gray-300">
                No collections found.
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDangerModal
        open={confirmMode === "clear"}
        title="Clear selected collections"
        description={`This will delete all documents from ${selectedList.length} selected collection(s), but keep the collections themselves.`}
        confirmLabel="Clear now"
        dangerLevel="medium"
        confirmDisabled={!anySelected}
        onClose={() => setConfirmMode(null)}
        onConfirm={async () => {
          await clearSelected();
          setConfirmMode(null);
        }}
      />

      <ConfirmDangerModal
        open={confirmMode === "dropCollections"}
        title="Drop selected collections"
        description={`This will permanently drop ${selectedList.length} collection(s) including indexes. This cannot be undone.`}
        confirmLabel="Drop collections"
        dangerLevel="high"
        confirmDisabled={!anySelected}
        onClose={() => setConfirmMode(null)}
        onConfirm={async () => {
          await dropSelectedCollections();
          setConfirmMode(null);
        }}
      />

      <ConfirmDangerModal
        open={confirmMode === "dropDb"}
        title="Drop entire database"
        description="This will permanently drop the entire database. Your app may stop working until data is re-created."
        confirmLabel="Drop database"
        dangerLevel="high"
        onClose={() => setConfirmMode(null)}
        onConfirm={async () => {
          await dropDatabase();
          setConfirmMode(null);
        }}
      />
    </div>
  );
}
