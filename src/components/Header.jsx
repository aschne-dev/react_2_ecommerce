import {
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import "./Header.css";

import { useEffect, useMemo, useState } from "react";
import cartIcon from "../assets/images/icons/cart-icon.png";
import searchIcon from "../assets/images/icons/search-icon.png";
import logoWhite from "../assets/images/logo-white.png";
import logoMobileWhite from "../assets/images/mobile-logo-white.png";

export default function Header({ cart }) {
  // STATE
  // Track route to handle search submissions differently on home vs other pages.
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search");
  // Keep a local copy so the user can type without updating the URL until submit.
  const [searchInput, setSearchInput] = useState(search ?? "");

  useEffect(() => {
    // Sync the input if the URL search param changes externally.
    setSearchInput(search ?? "");
  }, [search]);

  // Compute cart quantity only when cart entries change.
  const totalQuantity = useMemo(() => {
    return cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  }, [cart]);

  // COMPORTEMENTS
  const searchInputChanged = (event) => {
    setSearchInput(event.target.value);
  };

  const submitSearch = (event) => {
    // Prevent the form submit from reloading the page.
    event.preventDefault();
    const trimmedInput = searchInput.trim();

    if (!trimmedInput) {
      // Empty search: remove the query on home or redirect to a clean home URL.
      if (location.pathname === "/") {
        setSearchParams({});
      } else {
        navigate("/");
      }
      return;
    }

    const paramsString = createSearchParams({ search: trimmedInput }).toString();

    if (location.pathname === "/") {
      // Already on home: update the query string in place.
      setSearchParams({ search: trimmedInput });
    } else {
      // From another page: navigate home with the encoded search query.
      navigate({ pathname: "/", search: `?${paramsString}` });
    }
  };

  // RENDER
  return (
    <div className="header">
      <div className="left-section">
        <NavLink to="/" className="header-link">
          <img className="logo" src={logoWhite} />
          <img className="mobile-logo" src={logoMobileWhite} />
        </NavLink>
      </div>

      <div className="middle-section">
        <form className="search-form" onSubmit={submitSearch}>
          <input
            className="search-bar"
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={searchInputChanged}
          />

          <button className="search-button" type="submit">
            <img className="search-icon" src={searchIcon} />
          </button>
        </form>
      </div>

      <div className="right-section">
        <NavLink className="orders-link header-link" to="/orders">
          <span className="orders-text">Orders</span>
        </NavLink>

        <NavLink className="cart-link header-link" to="/checkout">
          <img className="cart-icon" src={cartIcon} />
          <div className="cart-quantity">{totalQuantity}</div>
          <div className="cart-text">Cart</div>
        </NavLink>
      </div>
    </div>
  );
}
