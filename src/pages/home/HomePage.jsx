import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router";
import Header from "../../components/Header";
import { fetchProducts } from "../../lib/api";
import "./HomePage.css";
import ProductsGrid from "./ProductsGrid";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", search],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ page: pageParam, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const totalItems = lastPage.pagination?.totalItems ?? 0;
      const loadedItems = pages.reduce(
        (sum, page) => sum + page.products.length,
        0
      );

      if (totalItems === 0) {
        return lastPage.products.length > 0 ? pages.length + 1 : undefined;
      }

      return loadedItems < totalItems ? pages.length + 1 : undefined;
    },
  });

  const products = data?.pages.flatMap((page) => page.products) ?? [];
  const hasMore = hasNextPage ?? isFetching;

  const loadMoreProducts = () => {
    if (!hasNextPage) return;
    fetchNextPage();
  };

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={loadMoreProducts}
      hasMore={hasMore}
      loader={<p>Loading...</p>}
      endMessage={<p>No more data to load.</p>}
    >
      <div>
        <title>Ecommerce Project</title>
        <link rel="icon" type="image/svg+xml" href="/home-favicon.png" />

        <Header />

        <div className="home-page">
          {isFetching && !isFetchingNextPage && products.length === 0 ? (
            <p className="loading-message">Chargement...</p>
          ) : null}
          {error ? (
            <p className="error-message">
              Impossible de charger les produits. Merci de réessayer.
            </p>
          ) : null}
          {products.length > 0 ? <ProductsGrid products={products} /> : null}
        </div>
      </div>
    </InfiniteScroll>
  );
}
