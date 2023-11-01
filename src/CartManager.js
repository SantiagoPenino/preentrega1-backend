import fs from "fs";

export class CartManager {
  constructor() {
    this.path = "./carts.json";
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(cartsJSON);
      } else return [];
    } catch (error) {
      return { error: "Error getting carts" };
    }
  }

  async #getMaxId() {
    try {
      let maxId = 0;
      const carts = await this.getCarts();
      carts.map((cart) => {
        if (cart.id > maxId) {
          maxId = cart.id;
        }
      });
      return maxId;
    } catch (error) {
      return { error: "Error getting max id" };
    }
  }

  async addCart() {
    try {
      const cart = {
        id: (await this.#getMaxId()) + 1,
        products: [],
      };
      const cartsFile = await this.getCarts();
      cartsFile.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
      return cart;
    } catch (error) {
      return { error: "Error adding cart" };
    }
  }

  async getCartById(cid) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === cid);
      if (!cart) {
        return false;
      }
      return cart;
    } catch (error) {
      return { error: "Cart not found" };
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getCarts();
      const currentCart = await this.getCartById(Number(cid));
      console.log(currentCart);
      if (currentCart) {
        const currentProduct = currentCart.products.find((p) => p.id === pid);
        if (currentProduct) {
          currentProduct.quantity + 1;
        } else {
          const addedProduct = {
            product: pid,
            quantity: 1,
          };
          currentCart.products.push(addedProduct);
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        console.log(currentCart);
        return currentCart;
      }
    } catch (error) {
      return { error: "Error adding product to cart" };
    }
  }
}
