'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { InquiryItem } from '@greenacres/types';

interface CartContextType {
    items: InquiryItem[];
    addToCart: (item: InquiryItem) => void;
    removeFromCart: (coffeeId: string) => void;
    clearCart: () => void;
    itemCount: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<InquiryItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('inquiry-cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('inquiry-cart', JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addToCart = (newItem: InquiryItem) => {
        setItems(current => {
            const existingIndex = current.findIndex(
                i => i.coffeeId === newItem.coffeeId && i.preferredLocation === newItem.preferredLocation
            );

            if (existingIndex >= 0) {
                // Update quantity for existing item
                const updated = [...current];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + newItem.quantity
                };
                return updated;
            }

            return [...current, newItem];
        });
        setIsOpen(true); // Open cart when adding
    };

    const removeFromCart = (coffeeId: string) => {
        setItems(current => current.filter(i => i.coffeeId !== coffeeId));
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('inquiry-cart');
    };

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            clearCart,
            itemCount: items.length,
            isOpen,
            setIsOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
