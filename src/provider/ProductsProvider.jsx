import { useState } from "react";
import { SelectedProductContext } from "../context/SelectedProductContext";

const ProductsProvider = ({ children }) => {
  const [selectedId, setSelectedId] = useState(null);

  const contextValue = { selectedId, setSelectedId };

  return (
    <SelectedProductContext.Provider value={contextValue}>
      {children}
    </SelectedProductContext.Provider>
  );
};

export default ProductsProvider;
