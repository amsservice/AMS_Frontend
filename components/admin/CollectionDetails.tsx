"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import ConfirmDangerModal from "@/components/admin/ConfirmDangerModal";

type Document = {
  _id: string;
  [key: string]: any;
};

type DocumentsResponse = {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function CollectionDetails() {
  const params = useParams();
  const router = useRouter();
  const collectionName = params.collectionName as string;

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmMode, setConfirmMode] = useState<null | "deleteSelected" | "deleteAll">(
    null
  );

  const selectedList = Object.keys(selected).filter((k) => selected[k]);
  const allSelected = documents.length > 0 && documents.every((d) => selected[d._id]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = (await adminFetch(
        `/api/admin/db/collections/${encodeURIComponent(collectionName)}/documents?page=${page}&limit=20`
      )) as DocumentsResponse;
      setDocuments(res.documents || []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);

      setSelected((prev) => {
        const next: Record<string, boolean> = {};
        for (const doc of res.documents || []) {
          next[doc._id] = prev[doc._id] || false;
        }
        return next;
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [collectionName, page]);

  const toggleAll = () => {
    setSelected((prev) => {
      const next = { ...prev };
      for (const doc of documents) {
        next[doc._id] = !allSelected;
      }
      return next;
    });
  };

  const toggleDocument = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteSelected = async () => {
    const promise = adminFetch(
      `/api/admin/db/collections/${encodeURIComponent(collectionName)}/documents`,
      {
        method: "DELETE",
        body: JSON.stringify({ documentIds: selectedList }),
      }
    ) as Promise<{ deletedCount: number }>;

    toast.promise(promise, {
      loading: "Deleting selected documents...",
      success: `Deleted ${selectedList.length} document(s)`,
      error: (err) => (err instanceof Error ? err.message : "Delete failed"),
    });

    await promise;
    setSelected({});
    await fetchDocuments();
  };

  const deleteAll = async () => {
    const promise = adminFetch(
      `/api/admin/db/collections/${encodeURIComponent(collectionName)}/documents/all`,
      {
        method: "DELETE",
      }
    ) as Promise<{ deletedCount: number }>;

    toast.promise(promise, {
      loading: "Deleting all documents...",
      success: `Deleted all documents from collection`,
      error: (err) => (err instanceof Error ? err.message : "Delete failed"),
    });

    await promise;
    setSelected({});
    await fetchDocuments();
  };

  const formatDocument = (doc: Document) => {
    const { _id, ...rest } = doc;
    return JSON.stringify(rest, null, 2);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <div className="text-2xl font-bold text-white">{collectionName}</div>
            <div className="text-sm text-gray-300">
              {total} document{total !== 1 ? "s" : ""} total
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              disabled={documents.length === 0}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {allSelected ? (
                <CheckSquare className="w-5 h-5 text-white" />
              ) : (
                <Square className="w-5 h-5 text-white" />
              )}
            </button>
            <span className="text-sm text-gray-300">
              {selectedList.length} selected
            </span>
          </div>

          <div className="flex gap-2">
            {selectedList.length > 0 && (
              <Button
                onClick={() => setConfirmMode("deleteSelected")}
                variant="outline"
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                type="button"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedList.length})
              </Button>
            )}
            {total > 0 && (
              <Button
                onClick={() => setConfirmMode("deleteAll")}
                variant="outline"
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                type="button"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Delete All ({total})
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No documents in this collection
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selected[doc._id]
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
                onClick={() => toggleDocument(doc._id)}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDocument(doc._id);
                    }}
                    className="mt-1 flex-shrink-0"
                    type="button"
                  >
                    {selected[doc._id] ? (
                      <CheckSquare className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400 mb-2 font-mono">
                      ID: {doc._id}
                    </div>
                    <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap break-all">
                      {formatDocument(doc)}
                    </pre>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-300">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10"
              type="button"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </motion.div>

      {confirmMode === "deleteSelected" && (
        <ConfirmDangerModal
          open
          title="Delete Selected Documents"
          description={`Are you sure you want to delete ${selectedList.length} selected document(s)? This action cannot be undone.`}
          confirmLabel="DELETE"
          dangerLevel="high"
          onConfirm={async () => {
            await deleteSelected();
            setConfirmMode(null);
          }}
          onClose={() => setConfirmMode(null)}
        />
      )}

      {confirmMode === "deleteAll" && (
        <ConfirmDangerModal
          open
          title="Delete All Documents"
          description={`Are you sure you want to delete ALL ${total} documents from this collection? This action cannot be undone.`}
          confirmLabel="DELETE ALL"
          dangerLevel="high"
          onConfirm={async () => {
            await deleteAll();
            setConfirmMode(null);
          }}
          onClose={() => setConfirmMode(null)}
        />
      )}
    </div>
  );
}
