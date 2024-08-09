import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const retrieveProducts = async ({ queryKey }) => {
  const response = await axios.get(
    `http://localhost:3000/products?_page=${queryKey[1].page}_per_page=6}`
  );
  return response.data;
};

const ProductList = () => {
  const queryclient = useQueryClient();

  const [page, setPage] = useState(1);

  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", { page }],
    queryFn: retrieveProducts,
    retry: false,
    // refetchInterval: 1000,
  });

  // mutation function
  const mutation = useMutation({
    mutationFn: async (id) =>
      await axios?.delete(`http://localhost:3000/products/${id}`),
    onSuccess: () => {
      queryclient?.invalidateQueries(["products"]);
    },
  });

  // delete product function

  const handleDelete = async (id) => {
    // check for confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmDelete) {
      try {
        mutation?.mutate(id);
      } catch (err) {
        console.log(err?.message);
      }
    }
  };

  if (isLoading) return <div>Fetching Products...</div>;
  if (error) return <div>An error occured: {error.message}</div>;

  return (
    <div className="flex flex-col justify-center items-center w-3/5">
      <h2 className="text-3xl my-2">Product List</h2>
      <ul className="flex flex-wrap justify-center items-center">
        {products?.data &&
          products?.data?.map((product) => (
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

        {/* delete button  */}
        <button
          onClick={() => handleDelete(products?.product?.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded absolute right-2 top-5"
        >
          Delete
        </button>
      </ul>
      <div className="flex">
        {products.prev && (
          <button
            className="p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm"
            onClick={() => setPage(products?.prev)}
          >
            {" "}
            Prev{" "}
          </button>
        )}
        {products.next && (
          <button
            className="p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm"
            onClick={() => setPage(products?.next)}
          >
            {" "}
            Next{" "}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductList;
