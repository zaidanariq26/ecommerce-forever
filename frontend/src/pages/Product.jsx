import { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import SEO from "../components/SEO";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = useCallback(() => {
    const product = products.find((item) => item._id === productId);

    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [products, productId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId, products]);

  useEffect(() => {
    fetchProductData();
    setSize("");
  }, [fetchProductData]);

  if (products.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-10">
        <Loading type="spinner" size="text-4xl" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-10">
        <Icon
          icon="solar:question-circle-outline"
          className="text-6xl text-gray-300"
        />
        <p className="text-xl text-gray-500">Product not found</p>
        <Link
          to="/collection"
          className="mt-2 bg-gray-900 px-8 py-3 text-sm text-white hover:bg-gray-800"
        >
          Back to Collection
        </Link>
      </div>
    );
  }

  return productData ? (
    <div className="pt-10 opacity-100 transition-opacity duration-500 ease-in">
      <SEO title={productData.name} />
      {/* Product Data */}
      <div className="flex flex-col gap-12 sm:flex-row sm:gap-12">
        {/* ----- Product Images ----- */}
        <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row">
          <div className="flex w-full justify-between overflow-x-auto sm:w-[18.7%] sm:flex-col sm:justify-normal sm:overflow-y-scroll">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="flex-shrink- w-[24%] cursor-pointer sm:mb-3 sm:w-full"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="h-auto w-full" alt="" />
          </div>
        </div>

        {/* ----- Product Info ----- */}
        <div className="flex-1">
          <h1 className="mt-2 text-2xl font-medium">{productData.name}</h1>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="my-8 flex flex-col gap-4">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`cursor-pointer border border-gray-300 bg-gray-100 px-4 py-2 hover:bg-gray-200 ${item === size ? "border-orange-500" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="cursor-pointer bg-gray-900 px-8 py-3 text-sm text-white active:bg-gray-700"
          >
            Add To Cart
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="mt-5 flex flex-col gap-1 text-sm text-gray-500">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ----- Description Section ----- */}
      <div className="mt-20">
        <div className="mb-px flex gap-px">
          <strong className="border border-gray-300 px-5 py-3 text-sm">
            Description
          </strong>
        </div>
        <div className="flex flex-col gap-4 border border-gray-300 p-6 text-sm text-gray-500">
          <p>{productData.description}</p>
          <p>
            Please check the available sizes before adding to cart. Product
            colors may vary slightly depending on your screen, but every order
            is packed with care and ready for daily rotation.
          </p>
        </div>
      </div>

      {/* ----- Display Related Products ----- */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
