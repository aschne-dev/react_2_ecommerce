import { Link } from "react-router";
import "./CheckoutHeader.css";

import checkoutLockIcon from "../../assets/images/icons/checkout-lock-icon.png";
import logo from "../../assets/images/logo.png";
import mobileLogo from "../../assets/images/mobile-logo.png";

export default function CheckoutHeader({ paymentSummary }) {
  return (
    <div className="checkout-header">
      <div className="header-content">
        <div className="checkout-header-left-section">
          <Link to="/">
            <img className="logo" src={logo} />
            <img className="mobile-logo" src={mobileLogo} />
          </Link>
        </div>

        <div className="checkout-header-middle-section">
          Checkout (
          <Link className="return-to-home-link" to="/">
            {paymentSummary && paymentSummary.totalItems} items
          </Link>
          )
        </div>

        <div className="checkout-header-right-section">
          <img src={checkoutLockIcon} />
        </div>
      </div>
    </div>
  );
}
