
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FormEvent } from "react";

interface SearchCustomerFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: FormEvent) => void;
}

const SearchCustomerForm = ({
  searchQuery,
  setSearchQuery,
  onSearch,
}: SearchCustomerFormProps) => {
  return (
    <form onSubmit={onSearch} className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search customer code, name, or address..."
        className="w-full pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
};

export default SearchCustomerForm;
