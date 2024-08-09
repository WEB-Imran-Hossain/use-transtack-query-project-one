import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SelectedProductContext } from "../context/SelectedProductContext";

const retrieveProduct = async ({ queryKey }) => {
  const [entity, id] = queryKey;
  const response = await axios.get(`http://localhost:3000/${entity}/${id}`);
  return response.data;
};

const ProductDetails = () => {
  const { selectedId } = useContext(SelectedProductContext);
  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", selectedId],
    queryFn: retrieveProduct,
    enabled: !!selectedId,
  });

  if (!selectedId)
    return (
      <div className="w-1/5 flex-1 text-start text-3xl my-2 font-bold">
        No product selected{" "}
      </div>
    );

  if (isLoading) return <div>Fetching Product Details...</div>;
  if (error) return <div>An error occured: {error?.message}</div>;

  return (
    <div className="w-1/4 my-2">
      <h1 className="text-3xl my-2 font-bold">Product Details</h1>
      <div className="border bg-gray-100 p-1 text-md rounded flex flex-col p-5">
        <img
          src={product?.thumbnail}
          alt={product?.title}
          className="object-cover h-24 w-24 border rounded-full m-auto"
        />
        <p className="text-xl mt-3 font-bold">{product?.title}</p>
        <p>{product?.description}</p>
        <p>USD {product?.price}</p>
        <p>{product?.rating}/5</p>
      </div>
    </div>
  );
};

export default ProductDetails;
