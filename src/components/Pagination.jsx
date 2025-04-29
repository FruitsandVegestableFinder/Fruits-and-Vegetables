function Pagination({ handlePageChange, currentPage, totalPages }) {
  return (
    <div className="flex justify-center my-4">
        <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm mr-2"
        >Previous</button>
        <span className="mx-2">Page {currentPage} of {totalPages == 0 ? 1 : totalPages}</span>
        <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={(currentPage === totalPages) || (totalPages == 0)}
            className="btn btn-sm ml-2"
        >Next</button>
    </div>
  )
}

export default Pagination;
