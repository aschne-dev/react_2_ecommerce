import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { api } from "../../lib/api";
import Header from "../../components/Header";
import "./HomePage.css";
import ProductsGrid from "./ProductsGrid";

export default function HomePage({ cart, loadCart }) {
  // STATE
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  // COMPORTEMENTS
  useEffect(() => {
    const getHomeData = async () => {
      const response = await api.get(
        `/products${search ? `?search=${search}` : ""}`
      );
      setProducts(response.data);
    };

    getHomeData();
  }, [search]);

  // RENDER
  return (
    <>
      <title>Ecommerce Project</title>
      <link rel="icon" type="image/svg+xml" href="/home-favicon.png" />

      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}
