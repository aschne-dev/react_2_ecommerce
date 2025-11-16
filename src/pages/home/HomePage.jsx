import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router";
import Header from "../../components/Header";
import { api } from "../../lib/api";
import "./HomePage.css";
import ProductsGrid from "./ProductsGrid";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  // Reset pagination results whenever the search query changes.
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setTotalProducts(0);
  }, [search]);

  const fetchProducts = useCallback(
    async (abortSignal) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        if (search) {
          params.set("search", search);
        }

        const response = await api.get(`/products?${params.toString()}`, {
          signal: abortSignal,
        });

        setProducts((previousProducts) =>
          page === 1
            ? response.data.products
            : [...previousProducts, ...response.data.products]
        );

        if (page === 1 && response.data.pagination) {
          setTotalProducts(response.data.pagination.totalItems);
        }
      } catch (requestError) {
        if (requestError.name !== "CanceledError") {
          setError("Unable to load products. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [page, search]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  const hasMore = totalProducts === 0 || products.length < totalProducts;

  const handleLoadMoreData = () => {
    if (isLoading || !hasMore) return;
    setPage((previousPage) => previousPage + 1);
  };

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={handleLoadMoreData}
      hasMore={hasMore}
      loader={<p>Loading...</p>}
      endMessage={<p>No more data to load.</p>}
    >
      <div>
        <title>Ecommerce Project</title>
        <link rel="icon" type="image/svg+xml" href="/home-favicon.png" />

        <Header />

        <div className="home-page">
          {error ? <p className="error-message">{error}</p> : null}
          <ProductsGrid products={products} />
        </div>
      </div>
    </InfiniteScroll>
  );
}
