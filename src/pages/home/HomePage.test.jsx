import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "./HomePage";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../../lib/api", () => ({
  api: mockApi,
}));

describe("HomePage component", () => {
  let loadCart;

  async function renderHomePageAndGetProducts() {
    render(
      <MemoryRouter>
        <HomePage cart={[]} loadCart={loadCart} />
      </MemoryRouter>
    );

    // Wait for product cards before interacting or asserting.
    return await screen.findAllByTestId("product-container");
  }

  beforeEach(() => {
    vi.clearAllMocks();
    loadCart = vi.fn();

    // Stub the catalog request so we always render a predictable list of products.
    mockApi.get.mockImplementation(async () => {
      // Only the products endpoint is relevant for these tests.
      return {
        data: [
          {
            id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            image: "images/products/athletic-cotton-socks-6-pairs.jpg",
            name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
            rating: {
              stars: 4.5,
              count: 87,
            },
            priceCents: 1090,
            keywords: ["socks", "sports", "apparel"],
          },
          {
            id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            image: "images/products/intermediate-composite-basketball.jpg",
            name: "Intermediate Size Basketball",
            rating: {
              stars: 4,
              count: 127,
            },
            priceCents: 2095,
            keywords: ["sports", "basketballs"],
          },
        ],
      };
    });
  });

  it("displays the products correct", async () => {
    const productContainers = await renderHomePageAndGetProducts();
    expect(productContainers.length).toBe(2);

    expect(
      within(productContainers[0]).getByText(
        "Black and Gray Athletic Cotton Socks - 6 Pairs"
      )
    ).toBeInTheDocument();

    expect(
      within(productContainers[1]).getByText("Intermediate Size Basketball")
    ).toBeInTheDocument();
  });

  it("Add a product to the cart", async () => {
    let addToCartButton;
    let quantitySelector;

    const productContainers = await renderHomePageAndGetProducts();

    const user = userEvent.setup();

    // Simulate add-to-cart flow for the first product.
    addToCartButton = within(productContainers[0]).getByTestId(
      "add-to-cart-button"
    );
    quantitySelector = within(productContainers[0]).getByTestId(
      "quantity-selector"
    );

    // Change quantity before adding to the cart.
    await user.selectOptions(quantitySelector, "2");
    await user.click(addToCartButton);

    // Repeat the flow for the second product to cover multiple entries.
    addToCartButton = within(productContainers[1]).getByTestId(
      "add-to-cart-button"
    );
    quantitySelector = within(productContainers[1]).getByTestId(
      "quantity-selector"
    );
    // Different quantity to ensure payload respects the selector value.
    await user.selectOptions(quantitySelector, "3");
    await user.click(addToCartButton);

    expect(mockApi.post).toHaveBeenCalledWith("/cart-items", {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
    });
    expect(mockApi.post).toHaveBeenCalledWith("/cart-items", {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 3,
    });

    // Every submission should refresh the cart summary.
    expect(loadCart).toHaveBeenCalledTimes(2);
  });
});
