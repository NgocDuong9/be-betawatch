import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  private cart = new Map<string, { productId: string; quantity: number }[]>();

  getCart(userId: string): { productId: string; quantity: number }[] {
    return this.cart.get(userId) || [];
  }

  addToCart(
    userId: string,
    createCartDto: CreateCartDto,
  ): { productId: string; quantity: number }[] {
    const { productId, quantity } = createCartDto as CreateCartDto;
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

  updateCart(
    userId: string,
    updateCartDto: UpdateCartDto,
  ): { productId: string; quantity: number }[] {
    // Logic to update cart based on updateCartDto
    return [];
  }

  clearCart(userId: string): void {
    this.cart.delete(userId);
  }
}
