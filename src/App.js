import React, { useEffect, useState } from "react";
import AddProductButton from "./components/AddProductButton";
import ProductList from "./components/ProductList";
import ProductPicker from "./components/ProductPicker";
import "./App.css";
import { fetchProducts } from "./store/productSlice";
import { useSelector, useDispatch } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App = () => {
  const [products, setProducts] = useState([
    { id: null, title: "Select Product", variants: [] },
  ]);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const dispatch = useDispatch();
  const { items: staticProducts } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    setProducts((prevProducts) => [
      ...prevProducts,
      { id: null, title: "Select Product", variants: [] },
    ]);
  };
  const handleEditProduct = (index) => {
    setEditingProductIndex(index);
    setPickerOpen(true);
  };

  const handleProductUpdate = (selectedVariants) => {
    const updatedProducts = [...products];
    if (selectedVariants.length > 0) {
      const productInfo = {
        id: selectedVariants[0].product_id,
        title: staticProducts.find(
          (p) => p.id === selectedVariants[0].product_id
        )?.title,
        variants: selectedVariants,
      };
      updatedProducts[editingProductIndex] = productInfo;
    }

    setProducts(updatedProducts);
    setPickerOpen(false);
  };

  const handleDeleteProduct = (index) => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
  };

  return (
    <div className="main-container">
      <h1 className="heading">Add Products</h1>
      <div className="sub-heading">
        <p className="sub-heading1">Product</p>
        <p className="sub-heading2">Discount</p>
      </div>

      <div className="search-bar">
     
          <ProductList
            products={products}
            onEdit={handleEditProduct}
            onAddProduct={handleAddProduct}
            onDelete={handleDeleteProduct}
          />
   
      </div>

      {isPickerOpen && (
        <ProductPicker
          onClose={() => setPickerOpen(false)}
          onSelect={handleProductUpdate}
          products={products}
          setProducts={setProducts}
          editingProductIndex={editingProductIndex}
        />
      )}
    </div>
  );
};

export default App;
