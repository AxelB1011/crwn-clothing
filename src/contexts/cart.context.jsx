import { createContext, useEffect, useReducer, useState } from "react";
import createAction from "../utils/reducer/reducer.utils"

const addCartItem = (cartItems, productToAdd) => {
    const existingCartItem = cartItems.find(
        (item) => item.id === productToAdd.id
    );
    if (existingCartItem) {
        return cartItems.map(
            (item) => item.id === productToAdd.id 
            ? {...item, quantity: item.quantity + 1}
            : item
        );
    }

    return [...cartItems, {...productToAdd, quantity: 1}];
};

const removeCartItem = (cartItems, productToRemove) => {
    const existingCartItem = cartItems.find(
        (item) => item.id === productToRemove.id
    );
    if (existingCartItem.quantity > 1) {
        return cartItems.map(
            (item) => item.id === productToRemove.id 
            ? {...item, quantity: item.quantity - 1}
            : item
        );
    }

    return cartItems.filter(item => item.id !== productToRemove.id);
};

const clearCartItem = (cartItems, productToClear) => cartItems.filter(item => item.id !== productToClear.id);


export const CartContext = createContext({
    isCartOpen: false,
    setIsCartOpen: () => {},
    cartItems: [],
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    clearItemFromCart: () => {},
    cartCount: 0,
    cartTotal: 0,
});

const CART_ACTION_TYPES = {
    SET_CART_ITEMS: "SET_CART_ITEMS",
    SET_IS_CART_OPEN: "SET_IS_CART_OPEN",
}

// Reducers only store readable values
const INITIAL_STATE = {
    isCartOpen: false,
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
};

const cartReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case CART_ACTION_TYPES.SET_CART_ITEMS:
            return {
                ...state,
                ...payload
            }
        case CART_ACTION_TYPES.SET_IS_CART_OPEN:
            return {
                ...state,
                isCartOpen: payload
            }
        default:
            throw new Error(`Unhandled type ${type} in cartReducer`);
    };

};

export const CartProvider = ({children}) => {
    // const [isCartOpen, setIsCartOpen] = useState(false);
    // const [cartItems, setCartItems] = useState([]);
    // const [cartCount, setCartCount] = useState(0);
    // const [cartTotal, setCartTotal] = useState(0);

    // useEffect(() => {
    //     const newCartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
    //     setCartCount(newCartCount);
    // }, [cartItems]);

    // useEffect(() => {
    //     const newTotal = cartItems.reduce((total, item) => total + (item.quantity*item.price), 0)
    //     setCartTotal(newTotal);
    // }, [cartItems]);

    const [ state, dispatch ] = useReducer(cartReducer, INITIAL_STATE);
    const { isCartOpen, cartItems, cartCount, cartTotal } = state;

    const updateCartItemsReducer = (newCartItems) => {
        /* 
            generate newCartTotal and newCartCount

            dispatch new action with payload {
                newCartItems,
                newCartTotal,
                newCartCount
            }
        */
       const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0);
       const newTotal = newCartItems.reduce((total, item) => total + (item.quantity*item.price), 0);
       dispatch(
        // { type: CART_ACTION_TYPES.SET_CART_ITEMS, 
        // payload: {
        //     cartItems: newCartItems,
        //     cartCount: newCartCount,
        //     cartTotal: newTotal,
        // } }
        createAction(CART_ACTION_TYPES.SET_CART_ITEMS, {
            cartItems: newCartItems,
            cartCount: newCartCount,
            cartTotal: newTotal,
        })
       )
    };

    const addItemToCart = (productToAdd) => {
        // setCartItems(addCartItem(cartItems, productToAdd));
        const newCartItems = addCartItem(cartItems, productToAdd);
        updateCartItemsReducer(newCartItems);
    };

    const removeItemFromCart = (productToRemove) => {
        // setCartItems(removeCartItem(cartItems, productToRemove));
        const newCartItems = removeCartItem(cartItems, productToRemove);
        updateCartItemsReducer(newCartItems);
    };

    const clearItemFromCart = (productToClear) => {
        // setCartItems(clearCartItem(cartItems, productToClear));
        const newCartItems = clearCartItem(cartItems, productToClear);
        updateCartItemsReducer(newCartItems);
    };

    const setIsCartOpen = (bool) => {
        dispatch( createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool) );
    };

    const value = { isCartOpen, setIsCartOpen, cartItems, addItemToCart, removeItemFromCart, clearItemFromCart, cartCount, cartTotal };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};
