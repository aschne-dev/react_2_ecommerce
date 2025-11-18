import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCartStore } from "../../store/CartStore";
import { renderWithQueryClient } from "../../test-utils";
import HomePage from "./HomePage";

const mockFetchProducts = vi.hoisted(() => vi.fn());
const mockAddCartItem = vi.hoisted(() => vi.fn());
const mockFetchCartItems = vi.hoisted(() => vi.fn());

vi.mock("../../lib/api", () => ({
  fetchProducts: mockFetchProducts,
  addCartItem: mockAddCartItem,
  fetchCartItems: mockFetchCartItems,
}));

vi.mock("react-infinite-scroll-component", () => ({
  default: ({ children, next, hasMore }) => (
    <div>
      {children}
      <button
        data-testid="infinite-scroll-next"
        onClick={next}
        disabled={!hasMore}
      >
        Load more
      </button>
    </div>
  ),
}));

const mockProductsPage1 = [
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
];

const mockProductsPage2 = [
  {
    id: "4a0e4918-144c-4df9-b0d3-161d7b2b7bf5",
    image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
    name: "Adults Plain Cotton T-Shirt - 2 Pack",
    rating: {
      stars: 4.5,
      count: 56,
    },
    priceCents: 799,
    keywords: ["tshirts", "apparel"],
  },
  {
    id: "2f9e64b3-40c8-4d76-a3e2-3aa7340d6557",
    image: "images/products/luxury-toilet-paper-12-pack.jpg",
    name: "Luxury Toilet Paper - 12 Pack",
    rating: {
      stars: 4.9,
      count: 203,
    },
    priceCents: 1599,
    keywords: ["bathroom", "essentials"],
  },
];

describe("HomePage component", () => {

  async function renderHomePageAndGetProducts() {
    renderWithQueryClient(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Wait for product cards before interacting or asserting.
    return await screen.findAllByTestId("product-container");
  }

  beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.getState().reset();
    mockFetchCartItems.mockResolvedValue([]);

    // Stub the catalog request so we always render a predictable list of products.
    mockFetchProducts.mockImplementation(({ page }) => {
      if (page === 1) {
        return Promise.resolve({
          products: mockProductsPage1,
          pagination: { totalItems: mockProductsPage1.length },
        });
      }

      return Promise.resolve({
        products: [],
        pagination: { totalItems: mockProductsPage1.length },
      });
    });
  });

  afterEach(() => {
    useCartStore.getState().reset();
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

  it("loads additional products when the infinite scroll requests more data", async () => {
    mockFetchProducts.mockImplementation(({ page }) => {
      if (page === 1) {
        return Promise.resolve({
          products: mockProductsPage1,
          pagination: { totalItems: 4 },
        });
      }
      return Promise.resolve({
        products: mockProductsPage2,
        pagination: { totalItems: 4 },
      });
    });

    const firstPageContainers = await renderHomePageAndGetProducts();
    expect(firstPageContainers).toHaveLength(2);

    expect(mockFetchProducts).toHaveBeenNthCalledWith(1, {
      page: 1,
      search: "",
    });

    const user = userEvent.setup();
    await user.click(screen.getByTestId("infinite-scroll-next"));

    const nextPageProduct = await screen.findByText(
      "Luxury Toilet Paper - 12 Pack"
    );
    expect(nextPageProduct).toBeInTheDocument();

    expect(mockFetchProducts).toHaveBeenNthCalledWith(2, {
      page: 2,
      search: "",
    });

    const allProducts = await screen.findAllByTestId("product-container");
    expect(allProducts).toHaveLength(4);
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

    expect(mockAddCartItem).toHaveBeenCalledTimes(2);
    expect(mockAddCartItem.mock.calls[0][0]).toEqual({
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
    });
    expect(mockAddCartItem.mock.calls[1][0]).toEqual({
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 3,
    });
  });
});
