import { Link } from "react-router";
import Header from "../components/Header";

export default function NotFound({ cart }) {
  return (
    <>
      <Header cart={cart} />
      <div className="not-found">
        <h1>Page not found</h1>
        <p>We can't seem to find the page you're looking for.</p>
        <Link to="/">Back to homepage</Link>
      </div>
    </>
  );
}
