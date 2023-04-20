export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  image_small: string;
  category: string;
  // rating: string;
  // rate: string;
  // count: string;
}

export async function getProducts(name?: string | null) {

  const url = 'https://lecollezioni-eg.com/MitchAPI/category.php';
  const data = { "attributes": {}, "category": "dress", "price_range": [0, 1000], "products_per_page": 90, "page_number": 1 };
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(url, options);
    const result: ApiResponse = await response.json();
    // Extract the products array from the API response
    const products: Product[] = result;
    return products;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}


interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    // total_products: number;
    // total_pages: number;
  };
}
export async function getProductBySlug(productSlug: string) {
  const url = 'https://lecollezioni-eg.com/MitchAPI/single.php';
  const formData = new FormData();
  formData.append('slug', productSlug);
  const options = {
    method: 'POST',
    body: formData,
  };
  try {
    const response = await fetch(url, options);
    const result: ApiResponse = await response.json();
    // Extract the products array from the API response
    const product: Product[] = result;
    return product;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}