import {
  createSearchParams,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import "./Header.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";
import cartIcon from "../assets/images/icons/cart-icon.png";
import searchIcon from "../assets/images/icons/search-icon.png";
import logoWhite from "../assets/images/logo-white.png";
import logoMobileWhite from "../assets/images/mobile-logo-white.png";
import { useCart } from "../context/CartContext";

export default function Header() {
  // STATE
  const { cart } = useCart(); // Read cart count directly from shared context.
  // Track route to handle search submissions differently on home vs other pages.
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // Local input mirrors the `search` query param so the field stays in sync.
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? ""
  );

  const search = searchParams.get("search");

  // COMPORTEMENTS
  useEffect(() => {
    // Sync the input if the URL search param changes externally.
    setSearchInput(search ?? "");
  }, [search]);

  // Compute cart quantity only when cart entries change.
  const totalQuantity = useMemo(() => {
    return cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  }, [cart]);

  const updateSearchQuery = useCallback(
    (query = "") => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        // Empty search: remove the query on home or redirect to a clean home URL.
        if (location.pathname === "/") {
          setSearchParams({});
        } else {
          navigate("/");
        }
        return;
      }

      const paramsString = createSearchParams({
        search: trimmedQuery,
      }).toString();

      if (location.pathname === "/") {
        // Already on home: update the query string in place.
        setSearchParams({ search: trimmedQuery });
      } else {
        // From another page: navigate home with the encoded search query.
        navigate({ pathname: "/", search: `?${paramsString}` });
      }
    },
    [location.pathname, navigate, setSearchParams]
  );

  // Debounce user typing so we only sync the URL after 500ms of inactivity.
  useDebounce(
    () => {
      const normalizedSearch = search ?? "";
      if (normalizedSearch === searchInput) {
        return;
      }

      updateSearchQuery(searchInput);
    },
    500,
    [searchInput, search, updateSearchQuery]
  );

  const searchInputChanged = (event) => {
    setSearchInput(event.target.value);
  };

  const submitSearch = (event) => {
    if (event) {
      event.preventDefault();
    }
    updateSearchQuery(searchInput);
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
