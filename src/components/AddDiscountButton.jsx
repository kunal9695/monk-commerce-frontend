import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import "./AddDiscountButton.css";

const AddDiscountButton = ({ product, onApplyDiscount }) => {
  const [showDiscountFields, setShowDiscountFields] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("flat");

  const handleAddDiscountClick = () => {
    setShowDiscountFields(true);
  };

  const handleCancel = () => {
    setShowDiscountFields(false);
    setDiscountValue("");
    setDiscountType("flat");
  };

  const handleApplyDiscount = () => {
    onApplyDiscount({ value: discountValue, type: discountType });
    handleCancel(); 
  };

  return (
    <div className="add-discount-container">
      {!showDiscountFields ? (
        <Button
          variant="outlined"
          onClick={handleAddDiscountClick}
          className="add-discount-button"
        >
          Add Discount
        </Button>
      ) : (
        <div className="discount-form">
          <TextField
            label="Discount Value"
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="discount-input"
            fullWidth
          />
          <FormControl fullWidth className="discount-dropdown">
            <InputLabel>Discount Type</InputLabel>
            <Select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <MenuItem value="percentage">Percentage (%)</MenuItem>
              <MenuItem value="flat">Flat</MenuItem>
            </Select>
          </FormControl>
          <div className="discount-actions">
            <Button
              variant="contained"
              onClick={handleApplyDiscount}
              className="apply-discount-btn"
            >
              Apply
            </Button>
            <Button
              variant="text"
              onClick={handleCancel}
              className="cancel-discount-btn"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDiscountButton;
