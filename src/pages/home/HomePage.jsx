import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Header from "../../components/Header";
import { api } from "../../lib/api";
import "./HomePage.css";
import ProductsGrid from "./ProductsGrid";

export default function HomePage() {
  // STATE
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  // COMPORTEMENTS
  useEffect(() => {
    const getHomeData = async () => {
      const response = await api.get(
        `/products${search ? `?search=${search}&` : "?"}limit=50`
      );
      console.log(response.data);
      setProducts(response.data.products);
    };

    getHomeData();
  }, [search]);

  // RENDER
  return (
    <>
      <title>Ecommerce Project</title>
      <link rel="icon" type="image/svg+xml" href="/home-favicon.png" />

      <Header />

      <div className="home-page">
        <ProductsGrid products={products} />
      </div>
    </>
  );
}
