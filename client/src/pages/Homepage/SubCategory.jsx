import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/subcategory.css";

export default function SubCategory({ title, books, view, theme }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const firstFive = books.slice(0, 5);

  return (
    <div className={`subcat-section ${theme}`}>
      <div className="subcat-header">
        <h2>{title}</h2>
        {view === "more" && !expanded && books.length > 5 && (
          <button className="more-btn" onClick={() => setExpanded(true)}>
            More →
          </button>
        )}
        {expanded && (
          <button className="more-btn" onClick={() => setExpanded(false)}>
            Hide ↑
          </button>
        )}
      </div>

      {view === "scroll" && (
        <div className="subcat-row scroll-row">
          {books.map((b) => (
            <div
              key={b._id}
              className="book-card"
              onClick={() => navigate(`/book/${b._id}`)}
            >
              <img src={b.image} alt={b.title} />
              <p>{b.title}</p>
            </div>
          ))}
        </div>
      )}

      {view === "more" && (
        <div className={`subcat-row ${expanded ? "grid-row" : "scroll-row"}`}>
          {(expanded ? books : firstFive).map((b) => (
            <div
              key={b.id}
              className="book-card"
              onClick={() => navigate(`/book/${b._id}`)}
            >
              <img src={b.image} alt={b.title} />
              <p>{b.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}