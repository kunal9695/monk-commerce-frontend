import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Modal, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import "./ProductPicker.css";

const ProductPicker = ({
  onClose,
  onSelect,
  products,
  setProducts,
  editingProductIndex,
}) => {
  const [search, setSearch] = useState("");
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const { items: staticProducts } = useSelector((state) => state.products);
  const [visibleProducts, setVisibleProducts] = useState(10);

  const filteredProducts = staticProducts.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );
  const fetchMoreData = () => {
    setTimeout(() => {
      setVisibleProducts((prevVisible) =>
        Math.min(prevVisible + 10, filteredProducts.length)
      );
    }, 1000);
  };

  const handleProductCheckboxChange = (product) => {
    const isProductSelected = selectedProductIds.includes(product.id);
    if (isProductSelected) {
      setSelectedProductIds((prev) => prev.filter((id) => id !== product.id));
      setSelectedVariants((prev) =>
        prev.filter(
          (variant) => !product.variants.some((v) => v.id === variant.id)
        )
      );
    } else {
      setSelectedProductIds((prev) => [...prev, product.id]);
      setSelectedVariants((prev) => [...prev, ...product.variants]);
    }
  };

  const toggleVariantSelection = (variant, product) => {
    const isVariantSelected = selectedVariants.some((v) => v.id === variant.id);

    if (isVariantSelected) {
      const updatedVariants = selectedVariants.filter(
        (v) => v.id !== variant.id
      );
      setSelectedVariants(updatedVariants);

      if (
        !updatedVariants.some((v) =>
          product.variants.some((pv) => pv.id === v.id)
        )
      ) {
        setSelectedProductIds((prev) => prev.filter((id) => id !== product.id));
      }
    } else {
      setSelectedVariants((prev) => [...prev, variant]);

      if (!selectedProductIds.includes(product.id)) {
        setSelectedProductIds((prev) => [...prev, product.id]);
      }
    }
  };

  const handleAddProducts = () => {
    const productsToAdd = selectedProductIds.map((productId) => {
      const product = staticProducts.find((p) => p.id === productId);
      return {
        ...product,
        selectedVariants: selectedVariants.filter((variant) =>
          product.variants.some((v) => v.id === variant.id)
        ),
      };
    });

    setProducts((prev) => {
      const filteredPrevProducts = prev.filter(
        (product) => product.id !== null && product.id !== undefined
      );

      const filteredPlaceholder = prev.filter(
        (product) => product.id === null || product.id === undefined
      );

      let newProducts = [];

      if (typeof editingProductIndex === "number" && editingProductIndex >= 0) {
        newProducts = [...prev];
        productsToAdd.forEach((product, idx) => {
          newProducts[editingProductIndex + idx] = product;
        });
      } else {
        if (filteredPlaceholder.length > 1) {
          newProducts = [
            ...filteredPrevProducts,
            ...productsToAdd,
            ...filteredPlaceholder.slice(0, filteredPlaceholder.length - 1),
          ];
        } else {
          newProducts = [...filteredPrevProducts, ...productsToAdd];
        }
      }
      return newProducts;
    });

    setSelectedProductIds([]);
    setSelectedVariants([]);
    onClose();
  };

  const isProductChecked = (product) => selectedProductIds.includes(product.id);

  return (
    <div>
      <Modal open={true} onClose={onClose}>
        <div className="modal-container">
          <div className="modal-header">
            <h5 className="modal-title">Select Products</h5>
            <button type="button" className="modal-close" onClick={onClose}>
              ×
            </button>
            <div className="line"></div>
            <TextField
              fullWidth
              placeholder="Search product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar-modal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <div className="line"></div>
          </div>
          <div id="modal-body" className="modal-body">
            <InfiniteScroll
              dataLength={visibleProducts}
              next={fetchMoreData}
              hasMore={visibleProducts < filteredProducts.length}
              loader={<h4>Loading...</h4>}
              scrollThreshold={0.95}
              scrollableTarget="modal-body"
            >
              {filteredProducts.slice(0, visibleProducts).map((product) => (
                <div key={product.id} style={{ marginBottom: "20px" }}>
                  <div className="product-title">
                    <input
                      type="checkbox"
                      checked={isProductChecked(product)}
                      onChange={() => handleProductCheckboxChange(product)}
                      style={{ marginRight: "10px" }}
                    />
                    <img
                      src={product.image.src}
                      alt={product.title}
                      width="50"
                      style={{ marginRight: "10px" }}
                    />
                    {product.title}
                    <div className="line"></div>
                  </div>
                  <div style={{ marginLeft: "25px" }}>
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="variant-container">
                        <div className="variant-container-text">
                          <input
                            type="checkbox"
                            checked={selectedVariants.some(
                              (v) => v.id === variant.id
                            )}
                            onChange={() =>
                              toggleVariantSelection(variant, product)
                            }
                            style={{ marginRight: "10px" }}
                          />
                          {variant.title}
                        </div>
                        <div> ${variant.price}</div>
                        <div className="line"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>
          <div className="modal-footer">
            <p>{selectedProductIds.length} product(s) selected</p>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProducts}
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductPicker;
