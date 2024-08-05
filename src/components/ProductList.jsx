import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const retrieveProducts = async ({queryKey}) => {
  const response = await axios.get(`http://localhost:3000/${queryKey[0]}`);
  return response.data;
};

const ProductList = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: retrieveProducts,
    retry: false,
  });

  if (isLoading) return <div>Fetching Products...</div>;
  if (error) return <div>An error occured: {error.message}</div>;

  return (
    <div className="flex flex-col justify-center items-center w-3/5">
      <h2 className="text-3xl my-2">Product List</h2>
      <ul className="flex flex-wrap justify-center items-center">
        {products &&
          products?.map((product) => (
            <li
              key={product?.id}
              className="flex flex-col items-center m-2 border rounded-sm"
            >
              <img
                className="object-cover h-64 w-96 rounded-sm"
                src={product?.thumbnail}
                alt=""
              />
              <p className="text-xl my-3">{product?.title}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ProductList;
