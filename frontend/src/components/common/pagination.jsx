import React from "react";
import PropTypes from "prop-types";
import _ from "lodash"; //this is for creating array of 1-pagesize

const Pagination = (props) => {
  const { itemsCount, pageSize, currentPage, onPageChange } = props;
  //console.log(currentPage);

  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null; //single page only then no need of pagination
  const pages = _.range(1, pagesCount + 1);
  return (
    <nav>
      <ul className="pagination">
        {pages.map((page) => (
          <li
            key={page}
            className={page === currentPage ? "page-item active" : "page-item "}
          >
            <button
              onClick={() => onPageChange(page)}
              className="page-link clickable"
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
