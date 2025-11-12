import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
  let loadCart;
  let paymentSummary;

  async function renderPaymentSummary() {
    function Location() {
      const location = useLocation();
      return <div data-testid="url-path">{location.pathname}</div>;
    }

    render(
      <MemoryRouter>
        <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
        <Location />
      </MemoryRouter>
    );

    // Wait until every payment-summary row is on screen before returning.
    return await screen.findAllByTestId("payment-summary-container");
  }

  beforeEach(() => {
    vi.clearAllMocks();
    loadCart = vi.fn();

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
