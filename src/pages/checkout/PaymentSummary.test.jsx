import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCartStore } from "../../store/CartStore";
import PaymentSummary from "./PaymentSummary";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../../lib/api", () => ({
  api: mockApi,
}));

describe("Payment Summary Component", () => {
  let paymentSummary;
  const originalLoadCart = useCartStore.getState().loadCart;

  const resetCartStoreState = () => {
    useCartStore.setState({ loadCart: originalLoadCart });
    useCartStore.getState().reset();
  };

  async function renderPaymentSummary({ cart = [] } = {}) {
    function Location() {
      const location = useLocation();
      return <div data-testid="url-path">{location.pathname}</div>;
    }

    useCartStore.setState({ cart });

    render(
      <MemoryRouter>
        <PaymentSummary paymentSummary={paymentSummary} />
        <Location />
      </MemoryRouter>
    );

    // Wait until every payment-summary row is on screen before returning.
    return await screen.findAllByTestId("payment-summary-container");
  }

  beforeEach(() => {
    vi.clearAllMocks();
    resetCartStoreState();

    // Shared summary fixture mirrors the API payload structure.
    paymentSummary = {
      totalItems: 11,
      productCostCents: 20377,
      shippingCostCents: 499,
      totalCostBeforeTaxCents: 20876,
      taxCents: 2088,
      totalCostCents: 22964,
    };
  });

  afterEach(() => {
    resetCartStoreState();
  });

  it("Displays payment summary correctly", async () => {
    const paymentSummaryContainers = await renderPaymentSummary();
    expect(paymentSummaryContainers.length).toBe(5);

    // First row shows the subtotal.
    expect(paymentSummaryContainers[0]).toHaveTextContent("$203.77");

    expect(
      within(paymentSummaryContainers[0]).getByText("Items (11):")
    ).toBeInTheDocument();

    expect(
      within(paymentSummaryContainers[1]).getByText("$4.99")
    ).toBeInTheDocument();

    expect(
      within(paymentSummaryContainers[2]).getByText("$208.76")
    ).toBeInTheDocument();

    expect(
      within(paymentSummaryContainers[3]).getByText("$20.88")
    ).toBeInTheDocument();

    expect(
      within(paymentSummaryContainers[4]).getByText("$229.64")
    ).toBeInTheDocument();
  });

  it("Place the order", async () => {
    const loadCart = vi.fn();
    useCartStore.setState({ loadCart });
    await renderPaymentSummary();

    const user = userEvent.setup();

    const placeOrderButton = screen.getByTestId("create-order-button");

    // Clicking CTA should submit the order, refresh cart and navigate.
    await user.click(placeOrderButton);

    expect(mockApi.post).toHaveBeenCalledWith("/orders");
    expect(loadCart).toHaveBeenCalled();
    expect(screen.getByTestId("url-path")).toHaveTextContent("/orders");
  });
});
