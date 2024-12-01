import React from "react";
import Button from "@mui/material/Button";
import "./AddProductButton.css";

const AddProductButton = ({ onAddProduct }) => {
  return (
    <Button
      variant="outlined"
      onClick={onAddProduct}
      className="add-product-button"
    >
      Add Product
    </Button>
  );
};

export default AddProductButton;
