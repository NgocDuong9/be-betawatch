import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  private cart = new Map<string, { productId: string; quantity: number }[]>();

  getCart(userId: string): { productId: string; quantity: number }[] {
    return this.cart.get(userId) || [];
  }

  addToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): { productId: string; quantity: number }[] {
    const userCart = this.cart.get(userId) || [];
    const existingProduct = userCart.find(
      (item) => item.productId === productId,
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      userCart.push({ productId, quantity });
    }

    this.cart.set(userId, userCart);
    return userCart;
  }

  removeFromCart(
    userId: string,
    productId: string,
  ): { productId: string; quantity: number }[] {
    const userCart = this.cart.get(userId) || [];
    const updatedCart = userCart.filter((item) => item.productId !== productId);

    this.cart.set(userId, updatedCart);
    return updatedCart;
  }

  clearCart(userId: string): void {
    this.cart.delete(userId);
  }
}
