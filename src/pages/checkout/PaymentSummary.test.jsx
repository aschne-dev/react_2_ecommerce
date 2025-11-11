import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentSummary from "./PaymentSummary";

vi.mock("axios");

describe("Payment Summary Component", () => {
  let loadCart;
  let paymentSummary;

  async function renderPaymentSummary() {
    render(
      <MemoryRouter>
        <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
      </MemoryRouter>
    );

    return await screen.findAllByTestId("payment-summary-container");
  }

  beforeEach(() => {
    loadCart = vi.fn();

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
});
