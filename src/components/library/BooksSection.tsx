
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BulkMarkFinished } from "./BulkMarkFinished";

interface BooksSectionProps {
  title: string;
  books: any[];
  type: "not-read" | "reading" | "finished";
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onBulkMark?: () => void;
  renderBookCard: (book: any) => React.ReactNode;
}

export const BooksSection: React.FC<BooksSectionProps & { cardBgColor?: string; cardBorderColor?: string }> = ({
  title, books, type,
  selectedIds,
  onToggleSelect,
  onBulkMark,
  renderBookCard,
  cardBgColor = "bg-white",
  cardBorderColor = "border-slate-200"
}) => (
  <section className={`rounded-3xl p-7 shadow mb-10 ${cardBgColor} border ${cardBorderColor} transition-all duration-200`}>
    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-7 flex items-center gap-2" data-testid={`${type}-section-title`}>
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
      <div className="rounded-lg bg-slate-50 border border-dashed border-slate-300 py-10">
        <p className="text-slate-400 text-center italic text-base">No books in this section</p>
      </div>
    ) : (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        data-testid={type === "not-read" ? "not-read-books" : type === "reading" ? "reading-books" : "finished-books"}
      >
        {books.map((book) =>
          type === "not-read" ? (
            <div key={book._id} className="relative min-h-[260px] flex flex-col">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-primary mt-2 ml-2"
                  checked={selectedIds?.has(book._id)}
                  onChange={() => onToggleSelect?.(book._id)}
                  data-testid={`select-book-${book._id}`}
                  style={{
                    // visually align checkbox with card padding
                    boxShadow: '0 1px 4px rgba(60,60,90,0.06)',
                  }}
                />
                <div className="flex-1">{renderBookCard(book)}</div>
              </div>
            </div>
          ) : (
            <div key={book._id} className="min-h-[260px] flex flex-col">{renderBookCard(book)}</div>
          )
        )}
      </div>
    )}
  </section>
);

