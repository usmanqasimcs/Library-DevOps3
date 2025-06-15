
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
  if (!books.length) return null;
  return (
    <div className="mb-4 flex flex-wrap gap-4 items-center" data-testid="bulk-action-bar">
      <span className="text-base font-semibold text-purple-700 mr-1">Bulk Actions:</span>
      <Button
        variant="default"
        size="sm"
        disabled={selectedIds.size === 0}
        onClick={onBulkMark}
        data-testid="bulk-finish-btn"
        className="text-base font-medium bg-green-600 hover:bg-green-700 text-white rounded-md transition py-2 px-4"
      >
        Mark as Finished
      </Button>
    </div>
  );
};
