import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCartStore } from "../../store/CartStore";
import Product from "./Product";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../../lib/api", () => ({
  api: mockApi,
}));

describe("Product component", () => {
  let product;
  let user;
  const originalLoadCart = useCartStore.getState().loadCart;

  const resetCartStoreState = () => {
    useCartStore.setState({ loadCart: originalLoadCart });
    useCartStore.getState().reset();
  };

  beforeEach(() => {
    // Shared fixture keeps expectations consistent across tests.
    product = {
      id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      image: "images/products/athletic-cotton-socks-6-pairs.jpg",
      name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
      rating: {
        stars: 4.5,
        count: 87,
      },
      priceCents: 1090,
      keywords: ["socks", "sports", "apparel"],
    };

    vi.clearAllMocks();
    resetCartStoreState();
    user = userEvent.setup();
  });

  afterEach(() => {
    resetCartStoreState();
  });

  it("displays the product details correctly", () => {
    render(<Product product={product} />);

    // Assert every important product detail renders.
    expect(
      screen.getByText("Black and Gray Athletic Cotton Socks - 6 Pairs")
    ).toBeInTheDocument();
    expect(screen.getByText("$10.90")).toBeInTheDocument();
    expect(screen.getByTestId("product-image")).toHaveAttribute(
      "src",
      "/images/products/athletic-cotton-socks-6-pairs.jpg"
    );
    expect(screen.getByTestId("product-rating-stars-image")).toHaveAttribute(
      "src",
      "/images/ratings/rating-45.png"
    );
    expect(screen.getByText("87")).toBeInTheDocument();
  });

  it("select a quantity", async () => {
    const loadCart = vi.fn();
    useCartStore.setState({ loadCart });

    render(<Product product={product} />);

    const quantitySelector = screen.getByTestId("quantity-selector");
    expect(quantitySelector).toHaveValue("1");

    await user.selectOptions(quantitySelector, "3");
    expect(quantitySelector).toHaveValue("3");

    const addToCartButton = screen.getByTestId("add-to-cart-button");
    await user.click(addToCartButton);

    // Quantity changes should drive the API payload and trigger a cart reload.
    expect(mockApi.post).toHaveBeenCalledWith("/cart-items", {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 3,
    });
    expect(loadCart).toHaveBeenCalled();
  });

  it("adds a product to the cart", async () => {
    const loadCart = vi.fn();
    useCartStore.setState({ loadCart });

    render(<Product product={product} />);

    const addToCartButton = screen.getByTestId("add-to-cart-button");
    await user.click(addToCartButton);

    // Default add-to-cart uses quantity 1 and still refreshes cart state.
    expect(mockApi.post).toHaveBeenCalledWith("/cart-items", {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 1,
    });
    expect(loadCart).toHaveBeenCalled();
  });
});
