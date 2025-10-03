/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ProductCard.css";

const ProductCard = ({ product, onDelete }) => {
  const { user } = useAuth();

  const canEdit =
    user && (user._id === product.createdBy._id || user.role === "admin");

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete(product._id);
    }
  };

  return (
    <div className="product-card">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-details">
          <span className="product-price">${product.price}</span>
          <span className="product-category">{product.category}</span>
          <span className="product-stock">Stock: {product.stock}</span>
        </div>
        <p className="product-author">By: {product.createdBy.name}</p>

        {canEdit && (
          <div className="product-actions">
            <Link to={`/products/edit/${product._id}`} className="btn btn-edit">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-delete">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
