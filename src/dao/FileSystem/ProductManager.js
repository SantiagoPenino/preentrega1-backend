import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(obj) {
    try {
      const product = {
        id: (await this.#getMaxId()) + 1,
        status: true,
        ...obj,
      };
      const products = await this.getProducts();
      const duplicatedCode = products.find(
        (product) => product.code === obj.code
      );
      if (duplicatedCode) {
        console.log("Duplicated code");
        throw new Error("Duplicated code");
      }
      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return product;
    } catch (error) {
      throw new Error("Error adding product");
    }
  }

  async #getMaxId() {
    try {
      let maxId = 0;
      const products = await this.getProducts();
      products.map((product) => {
        if (product.id > maxId) {
          maxId = product.id;
        }
      });
      return maxId;
    } catch (error) {
      throw new Error("Error getting max id");
    }
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const productsJSON = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(productsJSON);
      } else return [];
    } catch (error) {
      throw new Error("Error getting products");
    }
  }

  async getProductsByLimit(limit) {
    try {
      const products = await this.getProducts();
      if (!limit || limit >= products.length) {
        return products;
      } else {
        return products.slice(0, limit);
      }
    } catch (error) {
      throw new Error("Error getting products by limit");
    }
  }

  async getProductById(pid) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === pid);
      if (product) {
        return product;
      } else {
        console.error("Product not found");
        throw new Error("Product not found");
      }
    } catch (error) {
      throw new Error("Error getting product by id");
    }
  }

  async updateProduct(obj, id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((prod) => prod.id === id);
      if (index === -1) {
        return false;
      } else {
        const prodUpdated = { id, ...obj };
        products[index] = prodUpdated;
      }
      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (error) {
      throw new Error("Error updating product");
    }
  }

  async deleteProduct(productId) {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      if (products.length === updatedProducts.length) {
        console.error("Product not found...");
        return;
      }
      await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));
    } catch (error) {
      throw new Error("Error deleting product");
    }
  }
}
