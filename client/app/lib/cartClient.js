import { apiClient } from "@/app/lib/apiClient";

export const CART_STORAGE_KEY = "curator_cart";
export const CART_OWNER_KEY = "curator_cart_owner";

export const getStoredCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveLocalCart = (items) => {
  if (typeof window === "undefined") return;

  if (!items.length) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    window.localStorage.removeItem(CART_OWNER_KEY);
  } else {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }

  window.dispatchEvent(new Event("curator_cart_updated"));
};

export const addLocalCartItem = (cartItem) => {
  const items = getStoredCart();
  const existingIndex = items.findIndex((item) => item.id === cartItem.id);

  if (existingIndex > -1) {
    items[existingIndex].quantity += cartItem.quantity;
  } else {
    items.push(cartItem);
  }

  saveLocalCart(items);
  return items;
};

export const normalizeServerCartItem = (item) => ({
  id: item._id,
  itemId: item._id,
  productId: item.product?._id || item.product,
  title: item.product?.title || "Product",
  price: item.product?.price || 0,
  image: item.product?.thumbnail || "",
  sku: item.sku || "",
  variant: item.sku || "",
  quantity: item.quantity || 1,
  subtotal: item.subtotal || 0,
});

export const mapServerCartItems = (items) =>
  Array.isArray(items) ? items.map(normalizeServerCartItem) : [];

const getServerCart = async () => {
  const response = await apiClient.get("/cart/get");
  return response?.data;
};

const addServerCartItem = async ({ productId, sku, quantity }) => {
  const response = await apiClient.post("/cart/add", {
    productId,
    sku,
    quantity,
  });
  return response?.data;
};

const updateServerCartItem = async ({ productId, itemId, quantity }) => {
  const response = await apiClient.put("/cart/update", {
    productId,
    itemId,
    quantity,
  });
  return response?.data;
};

const removeServerCartItem = async ({ itemId }) => {
  const response = await apiClient.put("/cart/remove", { itemId });
  return response?.data;
};

export const getCartItems = async () => {
  try {
    const cart = await getServerCart();
    if (cart?.items) {
      const items = mapServerCartItems(cart.items);
      saveLocalCart(items);
      return { items, cartId: cart._id };
    }
  } catch {
    // fallback to local cart when server cart is unavailable
  }

  return { items: getStoredCart() };
};

export const addCartItem = async (cartItem) => {
  try {
    const cart = await addServerCartItem({
      productId: cartItem.productId,
      sku: cartItem.sku,
      quantity: cartItem.quantity,
    });
    const items = mapServerCartItems(cart.items);
    saveLocalCart(items);
    return { items, cartId: cart._id };
  } catch (error) {
    if (
      error?.message?.toLowerCase().includes("product already exist") ||
      error?.message?.toLowerCase().includes("already exist")
    ) {
      return getCartItems();
    }

    const items = addLocalCartItem({
      ...cartItem,
      subtotal: cartItem.price * cartItem.quantity,
    });
    return { items };
  }
};

export const updateCartItem = async ({ id, itemId, productId, quantity }) => {
  try {
    const cart = await updateServerCartItem({
      productId,
      itemId: itemId || id,
      quantity,
    });
    const items = mapServerCartItems(cart.items);
    saveLocalCart(items);
    return { items };
  } catch {
    const items = getStoredCart().map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
    );
    saveLocalCart(items);
    return { items };
  }
};

export const removeCartItem = async ({ id, itemId }) => {
  try {
    const cart = await removeServerCartItem({ itemId: itemId || id });
    const items = mapServerCartItems(cart.items);
    saveLocalCart(items);
    return { items };
  } catch {
    const items = getStoredCart().filter((item) => item.id !== id);
    saveLocalCart(items);
    return { items };
  }
};
