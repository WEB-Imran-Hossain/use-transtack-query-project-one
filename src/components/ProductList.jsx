import { useContext, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SelectedProductContext} from "../context/SelectedProductContext";

const retrieveProducts = async ({ queryKey }) => {
  const response = await axios.get(
    `http://localhost:3000/products?_page=${queryKey[1].page}_per_page=6}`
  );
  return response?.data;
};

const ProductList = () => {
  const queryclient = useQueryClient();
  const [page, setPage] = useState(1);
  const { setSelectedId } = useContext(SelectedProductContext);

  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", { page }],
    queryFn: retrieveProducts,
    retry: false,
    refetchInterval: 1000 * 60 * 5,
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
    <div className="flex flex-col justify-center items-center w-1/2">
      <h2 className="text-3xl my-2 font-bold">Product List</h2>
      <ul className="flex flex-wrap justify-center items-center">
        {products?.data &&
          products?.data?.map((product) => (
            <li
              key={product?.id}
              className="flex flex-col items-center m-2 border rounded-sm"
              onClick={() => setSelectedId(product?.id)} // Set selected product ID on click
            >
              <img
                className="object-cover h-96 w-96 rounded-sm cursor-pointer"
                src={product?.thumbnail}
                alt=""
              />

              <div className="flex justify-between items-center w-full px-4">
                <div>
                  <p className="text-xl my-5 font-bold">{product?.title}</p>
                </div>
                <div>
                  <button onClick={() => handleDelete(product?.id)}>
                    <p className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                      Delete
                    </p>
                  </button>
                </div>
              </div>
            </li>
          ))}
      </ul>

      <div className="flex my-5 gap-2">
        {products.prev && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-sm cursor-pointer"
            onClick={() => setPage(products?.prev)}
          >
            {" "}
            Prev{" "}
          </button>
        )}
        {products.next && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-sm cursor-pointer"
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
