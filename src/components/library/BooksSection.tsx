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
  <section className="bg-white rounded-2xl p-6 shadow mb-8 border border-slate-100 transition-all duration-200 hover:shadow-lg">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2" data-testid={`${type}-section-title`}>
      {type === "not-read"
        ? <>📚 <span>Not Read</span> <span className="ml-2 text-base font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">{books.length}</span></>
        : type === "reading"
        ? <>📖 <span>Currently Reading</span> <span className="ml-2 text-base font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700">{books.length}</span></>
        : <>✅ <span>Finished</span> <span className="ml-2 text-base font-semibold px-2 py-1 rounded bg-green-50 text-green-700">{books.length}</span></>
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
      <div className="rounded-lg bg-gradient-to-br from-slate-100 to-white border border-dashed border-slate-300 py-10">
        <p className="text-slate-400 text-center italic text-base">No books in this section</p>
      </div>
    ) : (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-testid={type === "not-read" ? "not-read-books" : type === "reading" ? "reading-books" : "finished-books"}
      >
        {books.map((book) =>
          type === "not-read" ? (
            <div key={book._id} className="relative">
              {/* Checkbox top-right for bulk select */}
              <input
                type="checkbox"
                className="absolute right-4 top-3 z-10 w-5 h-5 accent-primary"
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
  </section>
);
