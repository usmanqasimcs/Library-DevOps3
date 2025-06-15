
import React from "react";
import { Button } from "@/components/ui/button";
import { Book } from "@/types/book";

interface BulkMarkFinishedProps {
  books: Book[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onBulkMark: () => void;
}

export const BulkMarkFinished: React.FC<BulkMarkFinishedProps> = ({
  books, selectedIds, onToggle, onBulkMark
}) => {
  return (
    <div className="mb-3 flex flex-wrap gap-4 items-center" data-testid="bulk-action-bar">
      {books.length > 0 && (
        <>
          <span className="text-base font-semibold text-purple-700">Bulk Actions:</span>
          <Button
            variant="default"
            disabled={selectedIds.size === 0}
            onClick={onBulkMark}
            data-testid="bulk-finish-btn"
            className="h-9 px-5 text-base font-medium bg-green-600 hover:bg-green-700 text-white rounded-md transition"
          >
            Mark as Finished
          </Button>
        </>
      )}
    </div>
  );
};
