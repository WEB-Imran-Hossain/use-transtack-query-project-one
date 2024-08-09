import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddProduct = () => {
  const queryClient = useQueryClient();

  const [state, setState] = useState({
    title: "",
    description: "",
    price: 0,
    rating: 5,
    thumbnail: "",
  });

  const mutation = useMutation({
    mutationFn: (newProduct) =>
      axios.post("http://localhost:3000/products", newProduct),

  //   onSuccess: (data, variables, context) => {
  //     console.log(context);
  //     queryClient.invalidateQueries(["products"]);
  //   },
  //   onMutate: (variables) => {
  //     return { greeting: "Say hello" };
  //   },
  // });

  onSuccess: () => {
    // Reset the form state after a successful mutation
    setState({
      title: "",
      description: "",
      price: 0,
      rating: 5,
      thumbnail: "",
    });
    queryClient.invalidateQueries(["products"]);
  },
  onMutate: () => {
    return { greeting: "Say hello" };
  },
});

  const submitData = (event) => {
    event.preventDefault();
    console.log(state);
    const newData = { ...state, id: crypto.randomUUID().toString() };
    mutation.mutate(newData);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value =
      event.target.type === "number"
        ? event.target.valueAsNumber
        : event.target.value;

    setState({
      ...state,
      [name]: value,
    });
  };

  if (mutation.isLoading) {
    return <span>Submitting...</span>;
  }
  if (mutation.isError) {
    return <span>Error: {mutation.error.message}</span>;
  }

  return (
    <div className="w-1/4 my-2">
      <div>
        <h2 className="text-3xl my-2 font-bold text-center">Add a Product</h2>
      </div>
      <div className="m-2 p-6 bg-gray-100">
        {mutation.isSuccess && <p>Product Added!</p>}
        <form className="flex flex-col" onSubmit={submitData}>
          <input
            type="text"
            value={state.title}
            name="title"
            onChange={handleChange}
            className="my-2 border p-2 rounded"
            placeholder="Enter a product title"
          />
          <textarea
            value={state.description}
            name="description"
            onChange={handleChange}
            className="my-2 border p-2 rounded"
            placeholder="Enter a product description"
          />

          <input
            type="number"
            value={state.price}
            name="price"
            onChange={handleChange}
            className="my-2 border p-2 rounded"
            placeholder="Enter a product price"
          />
          <input
            type="text"
            value={state.thumbnail}
            name="thumbnail"
            onChange={handleChange}
            className="my-2 border p-2 rounded"
            placeholder="Enter a product thumbnail URL"
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/4 mx-auto"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
