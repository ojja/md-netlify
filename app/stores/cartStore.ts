import { persistentAtom } from '@nanostores/persistent';
import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
export type CartItem = {
    id: number;
    quantity: number;
    size?: string;
    color?: string;
    slug?: string;
    thumbnail?: string;
    price?: string;
};

const shoppingCart = persistentAtom<CartItem[]>('cart', [], {
    listen: true,
    encode: JSON.stringify,
    decode: JSON.parse,
})

const isShoppingCartOpen = persistentAtom<boolean>('isShoppingCartOpen', false, {
    listen: false,
    encode: (value) => String(value),
    decode: (value) => Boolean(value),
});


export const useShoppingCart = () => {
    if (typeof window === "undefined") {
        return {
            getItemQuantity: () => null,
            cartQuantity: 0,
            cartQuantityTotal: 0,
            cartItems: [],
            isOpen: false,
            addToCart: () => null,
            decreaseCartQuantity: () => null,
            removeFromCart: () => null,
            openCart: () => null,
            closeCart: () => null,
        };
    }
    const cartStore = useStore(shoppingCart);
    const isOpen = useStore(isShoppingCartOpen);

    const addToCart = (product: CartItem) => {
        const itemIndex = cartStore.findIndex((item) =>
            item.id === product.id &&
            item.size === product.size &&
            item.color === product.color &&
            item.slug === product.slug &&
            item.price === product.price &&
            item.thumbnail === product.thumbnail);

        if (itemIndex !== -1) {
            const newCartItems = [...cartStore];
            newCartItems[itemIndex].quantity++;
            shoppingCart.set(newCartItems);
        } else {
            shoppingCart.set([...cartStore, {
                id: product.id,
                size: product.size,
                color: product.color,
                slug: product.slug,
                thumbnail: product.thumbnail,
                price: product.price,
                quantity: product.quantity ?? 1
            }]);
        }
        return;
    }

    const decreaseCartQuantity = (product: CartItem) => {
        const itemIndex = cartStore.findIndex((item) => item.id === product.id && item.size === product.size && item.color === product.color);

        if (itemIndex !== -1) {
            const newCartItems = [...cartStore];
            if (newCartItems[itemIndex].quantity <= 1) {
                return removeFromCart(product.id);
            } else {
                newCartItems[itemIndex].quantity--;
                shoppingCart.set(newCartItems);
                return;
            }
        }
    }

    const removeFromCart = (itemId: number) => {
        const itemIndex = cartStore.findIndex((item) => item.id === itemId);

        if (itemIndex !== -1) {
            const newCartItems = [...cartStore];
            newCartItems.splice(itemIndex, 1);
            shoppingCart.set(newCartItems);
        }
        return;
    }

    const getItemQuantity = (product: CartItem) => {
        return cartStore.find((item) => item.id === product.id && item.size === product.size && item.color === product.color)?.quantity ?? 0;

    };

    const openCart = () => isShoppingCartOpen.set(true);
    const closeCart = () => isShoppingCartOpen.set(false);

    const [totalPrice, setTotalPrice] = useState(0);

    // Calculate the total price
    const calculateTotalPrice = () => {
        let price = 0;
        cartStore.map(item => {
            price += item.price * item.quantity;
        });
        setTotalPrice(price);
    }

    // Call calculateTotalPrice when the component mounts
    useEffect(() => {
        calculateTotalPrice();
    }, []);

    return {
        getItemQuantity,
        cartQuantity: cartStore?.length ?? 0,
        cartQuantityTotal: cartStore?.reduce((total, item) => total + item.quantity, 0) ?? 0,
        cartItems: cartStore ?? [],
        isOpen,
        addToCart,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        totalPrice,
    };
};

export default useShoppingCart;
