import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./ProductList.css";
import CloseIcon from "@mui/icons-material/Close";
import BulletSvg from "./BulletSvg.svg";
import AddProductButton from "./AddProductButton";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Dragula from "react-dragula";

const ProductList = ({
  products,
  onEdit,
  onAddProduct,
  onApplyDiscount,
  onDelete,
}) => {
  const [activeDiscount, setActiveDiscount] = useState({});
  const [isVariantsVisible, setIsVariantsVisible] = useState({});
  const [draggedProducts, setDraggedProducts] = useState(products);

  useEffect(() => {
      setDraggedProducts(products)
  },[products])

 
  useEffect(() => {
    console.log('drag')
    const container = document.querySelector('.product-list'); 
    const drake = Dragula([container]);
   
    drake.on('drop', (el, target, source, sibling) => {
      const newOrder = [...draggedProducts];
      const draggedIndex = newOrder.findIndex((product) => product.id === el.dataset.id); 
      const targetIndex = newOrder.findIndex((product) => product.id === sibling?.dataset?.id || target.dataset.id);

      if (draggedIndex !== -1 && targetIndex !== -1) {
     
        const [draggedItem] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedItem);
      }
      setDraggedProducts(newOrder); 
    });
    return () => {
      drake.destroy(); 
    };
  }, [draggedProducts,products]);

  const handleShowVariantsToggle = (productId) => {
    setIsVariantsVisible((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const handleAddDiscountClick = (productId) => {
    setActiveDiscount((prevState) => ({
      ...prevState,
      [productId]: true,
    }));
  };

  const handleDiscountChange = (productId, variantId, value, type) => {
    // onApplyDiscount(productId, variantId, { value, type });
  };

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        draggedProducts.map((product, index) => (
          <div key={product.id} className="product-item">
            <div className="list-container" data-id={index}>
              <div className="product-list-field">
                <img className="bullet-img" src={BulletSvg} alt="Bullet" />
                <p className="product-number">{index + 1}.</p>
                <div className="product-search-bar">
                  <div className="card-body d-flex justify-content-between">
                    <div>
                      <p className="product-title">{product.title}</p>
                    </div>
                    <div>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => onEdit(index)}
                        startIcon={<EditIcon />}
                        className="edit-button"
                      />
                    </div>
                  </div>
                </div>
                <div className="discount-section">
                  {activeDiscount[product.id] ? (
                    <div className="discount-inputs">
                      <input
                        type="number"
                        onChange={(e) =>
                          handleDiscountChange(
                            product.id,
                            null,
                            e.target.value,
                            "percentage"
                          )
                        }
                        className="discount-input-main"
                      />
                      <select
                        onChange={(e) =>
                          handleDiscountChange(
                            product.id,
                            null,
                            null,
                            e.target.value
                          )
                        }
                        className="discount-select-main"
                      >
                        <option className="text" value="percentage">
                          % Off
                        </option>
                        <option className="text" value="flat">
                          Flat Off
                        </option>
                      </select>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleAddDiscountClick(product.id)}
                      variant="contained"
                      color="secondary"
                      size="small"
                      className="add-discount-button"
                      disabled={
                        !(
                          product.selectedVariants &&
                          product.selectedVariants.length > 0
                        )
                      }
                    >
                      Add Discount
                    </Button>
                  )}
                </div>
                <div>
                  {products.length > 1 && (
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => onDelete(index)}
                      startIcon={<CloseIcon />}
                      className="delete-button"
                    />
                  )}
                </div>
              </div>

              {product.selectedVariants &&
                product.selectedVariants.length > 1 && (
                  <Button
                    onClick={() => handleShowVariantsToggle(product.id)}
                    variant="contained"
                    color="primary"
                    className="show-variants-button"
                    endIcon={
                      isVariantsVisible[product.id] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )
                    }
                  >
                    {isVariantsVisible[product.id]
                      ? "Hide Variants"
                      : "Show Variants"}
                  </Button>
                )}
              {product.selectedVariants &&
                product.selectedVariants.length === 1 && (
                  <ul className="product-variant-container">
                    <div>
                      {product.selectedVariants.map((variant) => (
                        <div style={{ display: "flex" }}>
                          <img
                            className="bullet-img-variant"
                            src={BulletSvg}
                            alt="Bullet"
                          />
                          <li key={variant.id} className="product-variant-list">
                            <div className="variant-details">
                              <p className="variant-detail-p">
                                {variant.title} - ${variant.price}
                              </p>
                            </div>
                          </li>
                        </div>
                      ))}
                    </div>
                    <div>
                      {product.selectedVariants.map((variant) => (
                        <div className="discount-section">
                          {activeDiscount[product.id] && (
                            <div className="discount-inputs">
                              <input
                                type="number"
                                onChange={(e) =>
                                  handleDiscountChange(
                                    product.id,
                                    variant.id,
                                    e.target.value,
                                    "percentage"
                                  )
                                }
                                className="discount-input"
                              />
                              <select
                                onChange={(e) =>
                                  handleDiscountChange(
                                    product.id,
                                    variant.id,
                                    null,
                                    e.target.value
                                  )
                                }
                                className="discount-select"
                              >
                                <option className="text" value="percentage">
                                  % Off
                                </option>
                                <option className="text" value="flat">
                                  Flat Off
                                </option>
                              </select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ul>
                )}

              {product.selectedVariants &&
                product.selectedVariants.length > 1 &&
                isVariantsVisible[product.id] && (
                  <ul className="product-variant-container">
                    <div>
                      {product.selectedVariants.map((variant) => (
                        <div style={{ display: "flex" }}>
                          <img
                            className="bullet-img-variant"
                            src={BulletSvg}
                            alt="Bullet"
                          />
                          <li key={variant.id} className="product-variant-list">
                            <div className="variant-details">
                              <p className="variant-detail-p">
                                {variant.title} - ${variant.price}
                              </p>
                            </div>
                          </li>
                        </div>
                      ))}
                    </div>
                    <div>
                      {product.selectedVariants.map((variant) => (
                        <div className="discount-section">
                          {activeDiscount[product.id] && (
                            <div className="discount-inputs">
                              <input
                                type="number"
                                onChange={(e) =>
                                  handleDiscountChange(
                                    product.id,
                                    variant.id,
                                    e.target.value,
                                    "percentage"
                                  )
                                }
                                className="discount-input"
                              />
                              <select
                                onChange={(e) =>
                                  handleDiscountChange(
                                    product.id,
                                    variant.id,
                                    null,
                                    e.target.value
                                  )
                                }
                                className="discount-select"
                              >
                                <option className="text" value="percentage">
                                  % Off
                                </option>
                                <option className="text" value="flat">
                                  Flat Off
                                </option>
                              </select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ul>
                )}
                {products.length > 1 &&
                  <div className="line-list"></div>
                }
             
            </div>
          </div>
        ))
      )}

      <div className="button-container">
        <AddProductButton onAddProduct={onAddProduct} />
      </div>
    </div>
  );
};

export default ProductList;
