import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) {
  
  const handlePageClick = (page: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange(page);
  };
  
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first and last page
      pageNumbers.push(1);
      
      if (currentPage <= 3) {
        // Near the start
        pageNumbers.push(2, 3, 4);
        pageNumbers.push("ellipsis");
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        // Middle - show current page and one on each side
        pageNumbers.push("ellipsis");
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        pageNumbers.push("ellipsis");
      }
      
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <Pagination>
      <PaginationContent>
        {/* Previous button */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href="#" onClick={handlePageClick(currentPage - 1)} />
          </PaginationItem>
        )}
        
        {/* Page numbers */}
        {getPageNumbers().map((pageNumber, index) => {
          if (pageNumber === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink 
                href="#" 
                isActive={pageNumber === currentPage}
                onClick={handlePageClick(pageNumber as number)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        {/* Next button */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href="#" onClick={handlePageClick(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default CustomPagination; 