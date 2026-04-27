"use client";

import { Button } from "@/components/ui";
import { useCart } from "@/context/CartContext";
import type { Item } from "@/types/item";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

export function AddToCartButton({
  item,
  size = "lg",
}: {
  item: Item;
  size?: "sm" | "md" | "lg";
}) {
  const { addToCart } = useCart();
  return (
    <Button
      size={size}
      leftIcon={<ShoppingCart className="h-4 w-4" />}
      onClick={() => {
        addToCart(item, 1);
        toast.success(`Added "${item.title}" to cart`);
      }}
    >
      Add to cart
    </Button>
  );
}
