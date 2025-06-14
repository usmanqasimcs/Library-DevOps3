
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BulkMarkFinished } from "./BulkMarkFinished";

interface BooksSectionProps {
  title: string;
  books: any[];
  type: "not-read" | "reading" | "finished";
  /** Only for not-read type */
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onBulkMark?: () => void;
  renderBookCard: (book: any) => React.ReactNode;
}

export const BooksSection: React.FC<BooksSectionProps> = ({
  title, books, type,
  selectedIds,
  onToggleSelect,
  onBulkMark,
  renderBookCard,
}) => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-4" data-testid={`${type}-section-title`}>
      {type === "not-read"
        ? `📚 Not Read (${books.length})`
        : type === "reading"
        ? `📖 Currently Reading (${books.length})`
        : `✅ Finished (${books.length})`
      }
    </h2>
    {type === "not-read" ?
      <BulkMarkFinished
        books={books}
        selectedIds={selectedIds!}
        onToggle={onToggleSelect!}
        onBulkMark={onBulkMark!}
      /> : null
    }
    {books.length === 0 ? (
      <Card data-testid={type === "not-read" ? "empty-not-read" : type === "reading" ? "empty-reading" : "empty-finished"}>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No books in this section</p>
        </CardContent>
      </Card>
    ) : (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        data-testid={type === "not-read" ? "not-read-books" : type === "reading" ? "reading-books" : "finished-books"}
      >
        {books.map((book) =>
          type === "not-read" ? (
            <div key={book._id} className="relative">
              {/* Checkbox top-right for bulk select */}
              <input
                type="checkbox"
                className="absolute right-2 top-2 z-10 w-4 h-4 accent-primary"
                checked={selectedIds?.has(book._id)}
                onChange={() => onToggleSelect?.(book._id)}
                data-testid={`select-book-${book._id}`}
              />
              {renderBookCard(book)}
            </div>
          ) : (
            <div key={book._id}>{renderBookCard(book)}</div>
          )
        )}
      </div>
    )}
  </div>
);
