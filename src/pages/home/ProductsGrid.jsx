import Product from "./Product";

export default function ProductsGrid({ products }) {
  // STATE

  return (
    <div className="products-grid">
      {products.map((product) => {
        return <Product key={product.id} product={product} />;
      })}
    </div>
  );
}
