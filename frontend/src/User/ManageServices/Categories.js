import React from "react";
import "../user-pages.css";

export default function Categories({ categories, onSelectCategory }) {
  return (
    <div className="user-section">
      <h2 className="user-title">Browse Wedding Service Categories</h2>
      <div className="user-grid user-grid-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            className="user-card"
            style={{ textAlign: "left" }}
          >
            <div className="user-card-title">{cat.name}</div>
            <div className="user-card-description">{cat.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}


