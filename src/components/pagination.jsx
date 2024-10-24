import React from 'react';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleRight,
  FaAngleLeft,
} from 'react-icons/fa'; // Import biểu tượng

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Hiển thị nút 1
    pageNumbers.push(
      <button
        key={1}
        onClick={() => handleClick(1)}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === 1
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700'
        }`}
      >
        1
      </button>
    );

    // Hiển thị dấu "..." bên trái nếu cần
    if (currentPage > 3 && totalPages > 4) {
      pageNumbers.push(
        <span key="dots-left" className="px-2">
          ...
        </span>
      );
    }

    // Hiển thị các nút trang gần currentPage
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    // Hiển thị dấu "..." bên phải nếu cần
    if (currentPage < totalPages - 2 && totalPages > 4) {
      pageNumbers.push(
        <span key="dots-right" className="px-2">
          ...
        </span>
      );
    }

    // Hiển thị nút cuối cùng nếu tổng số trang > 1
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handleClick(totalPages)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPages
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center my-4">
      {/* Nút về trang đầu */}
      {/* <button
        onClick={() => handleClick(1)}
        className="px-2 py-1 mx-1 rounded bg-white text-gray-700"
        disabled={currentPage === 1}
      >
        <FaAngleDoubleLeft />
      </button> */}

      {/* Nút Back */}
      <button
        onClick={() => handleClick(Math.max(currentPage - 1, 1))}
        className="px-3 py-1 mx-1 rounded bg-white text-gray-700"
        disabled={currentPage === 1}
      >
        <FaAngleLeft />
      </button>

      {/* Hiển thị các nút số trang */}
      {renderPageNumbers()}

      {/* Nút Next */}
      <button
        onClick={() => handleClick(Math.min(currentPage + 1, totalPages))}
        className="px-3 py-1 mx-1 rounded bg-white text-gray-700"
        disabled={currentPage === totalPages}
      >
        <FaAngleRight />
      </button>

      {/* Nút về trang cuối */}
      {/* <button
        onClick={() => handleClick(totalPages)}
        className="px-2 py-1 mx-1 rounded bg-white text-gray-700"
        disabled={currentPage === totalPages}
      >
        <FaAngleDoubleRight />
      </button> */}
    </div>
  );
};

export default Pagination;
