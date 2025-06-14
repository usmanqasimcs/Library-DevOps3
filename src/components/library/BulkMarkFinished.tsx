
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
    <div className="mb-2 flex flex-wrap gap-2 items-end" data-testid="bulk-action-bar">
      {books.length > 0 && (
        <>
          <span className="text-sm font-medium">Bulk actions:</span>
          <Button
            variant="default"
            disabled={selectedIds.size === 0}
            onClick={onBulkMark}
            data-testid="bulk-finish-btn"
          >
            Mark as Finished
          </Button>
        </>
      )}
    </div>
  );
};
