
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddBookSectionProps {
  showAddForm: boolean;
  onToggle: () => void;
  onAdd: (e: React.FormEvent<HTMLFormElement>) => void;
  newBook: { title: string; author: string; status: string };
  setNewBook: React.Dispatch<React.SetStateAction<{ title: string; author: string; status: string }>>;
}

export const AddBookSection: React.FC<AddBookSectionProps> = ({
  showAddForm, onToggle, onAdd, newBook, setNewBook
}) => (
  <Card data-testid="add-book-section">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>Add New Book</CardTitle>
        <Button onClick={onToggle} data-testid="toggle-add-form">
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Add Book'}
        </Button>
      </div>
    </CardHeader>
    {showAddForm && (
      <CardContent data-testid="add-book-form">
        <form onSubmit={onAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newBook.title}
                onChange={(e) => setNewBook((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter book title"
                required
                data-testid="title-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Author *</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newBook.author}
                onChange={(e) => setNewBook((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="Enter author name"
                required
                data-testid="author-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newBook.status}
                onChange={(e) => setNewBook((prev) => ({ ...prev, status: e.target.value }))}
                data-testid="status-input"
              >
                <option value="not-read">Not Read</option>
                <option value="reading">Reading</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full" data-testid="submit-book-button">
            Add Book to Library
          </Button>
        </form>
      </CardContent>
    )}
  </Card>
);
