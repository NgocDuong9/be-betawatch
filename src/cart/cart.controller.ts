import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post(':userId')
  addToCart(
    @Param('userId') userId: string,
    @Body() createCartDto: CreateCartDto,
  ) {
    return this.cartService.addToCart(userId, createCartDto);
  }

  @Patch(':userId')
  updateCart(
    @Param('userId') userId: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.updateCart(userId, updateCartDto);
  }

  @Delete(':userId')
  clearCart(@Param('userId') userId: string) {
    this.cartService.clearCart(userId);
    return { message: 'Cart cleared successfully' };
  }
}
