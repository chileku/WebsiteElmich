import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const existing = get().cart.find(
          (item) => item.ProductID === product.ProductID,
        );

        // Kiểm tra tồn kho khả dụng nếu có thông tin
        const available = Number(product.AvailableQuantity) ?? Infinity;
        const currentQty = existing ? (Number(existing.Quantity) || 0) : 0;
        
        // Quan trọng: Không dùng product.Quantity vì đó là tổng số lượng trong kho
        // Nếu truyền product.quantityToAdd thì dùng, không thì mặc định là 1
        const requestedAdd = Number(product.quantityToAdd) || 1;

        if (currentQty + requestedAdd > available) {
          toast.error("Số lượng vượt quá tồn kho khả dụng!");
          return;
        }

        if (existing) {
          set({
            cart: get().cart.map((item) =>
              item.ProductID === product.ProductID
                ? { ...item, Quantity: currentQty + requestedAdd }
                : item,
            ),
          });
          toast.success("Đã cập nhật số lượng giỏ hàng");
        } else {
          set({
            cart: [...get().cart, { ...product, Quantity: requestedAdd }],
          });
          toast.success("Đã thêm vào giỏ hàng");
        }
      },

      removeFromCart: (id) => {
        set({
          cart: get().cart.filter((item) => item.ProductID !== id),
        });

        toast.error("Đã xoá sản phẩm ");
      },

      decreaseQuantity: (id) => {
        const item = get().cart.find((i) => i.ProductID === id);
        if (!item) return;

        if (Number(item.Quantity) <= 1) {
          set({ cart: get().cart.filter((i) => i.ProductID !== id) });
          toast.error("Đã xoá sản phẩm ");
        } else {
          set({
            cart: get().cart.map((i) =>
              i.ProductID === id
                ? { ...i, Quantity: Number(i.Quantity) - 1 }
                : i,
            ),
          });
        }
      },

      clearCart: () => {
        set({ cart: [] });
        // toast("Đã xoá toàn bộ giỏ hàng");
      },

      getTotalPrice: () =>
        get().cart.reduce(
          (total, item) =>
            total + (Number(item.finalPrice) || Number(item.Price) || 0) * (Number(item.Quantity) || 0),
          0,
        ),

      getTotalItems: () =>
        get().cart.reduce((total, item) => total + (Number(item.Quantity) || 0), 0),
    }),
    {
      name: "cart-storage",
    },
  ),
);
