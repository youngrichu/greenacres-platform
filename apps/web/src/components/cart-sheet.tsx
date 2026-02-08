'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@greenacres/auth';
import { useCart } from '@/contexts/cart-context';
import { submitInquiryAction } from '@/app/actions/inquiry';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    Button,
    Input,
    Textarea
} from '@greenacres/ui';
import {
    ShoppingBag,
    Trash2,
    Loader2,
    Send,
    Plus,
    Minus,
    Package
} from 'lucide-react';
import { LocationLabels } from '@greenacres/types';

export function CartSheet() {
    const { user } = useAuth();
    const { items, removeFromCart, clearCart, isOpen, setIsOpen } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!user || items.length === 0) return;

        try {
            setIsSubmitting(true);

            const result = await submitInquiryAction(user, {
                coffeeItems: items,
                targetShipmentDate: targetDate ? new Date(targetDate) : undefined,
                message: message || undefined
            });

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    clearCart();
                    setIsOpen(false);
                    setMessage('');
                    setTargetDate('');
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to submit inquiry:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col bg-forest-deep border-l border-gold/20">
                <SheetHeader className="border-b border-gold/10 pb-4">
                    <SheetTitle className="text-cream text-xl font-serif flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gold" />
                        Inquiry List
                    </SheetTitle>
                    <SheetDescription className="text-cream/50">
                        Review your items before submitting a formal inquiry.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-gold/40" />
                            </div>
                            <p className="text-cream font-medium mb-1">Your list is empty</p>
                            <p className="text-cream/40 text-sm mb-4">
                                Browse our catalog to add coffees to your inquiry.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="btn-ghost"
                            >
                                Continue Browsing
                            </Button>
                        </div>
                    ) : success ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                                <Send className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-medium text-cream mb-2">Inquiry Sent!</h3>
                            <p className="text-cream/50 text-sm">
                                We've received your inquiry and will get back to you shortly.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={`${item.coffeeId}-${index}`}
                                    className="glass rounded-xl p-4 relative group"
                                >
                                    <button
                                        onClick={() => removeFromCart(item.coffeeId)}
                                        className="absolute top-2 right-2 p-2 text-cream/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                                            <Package className="w-5 h-5 text-gold" />
                                        </div>
                                        <div>
                                            <h4 className="text-cream font-medium">{item.coffeeName}</h4>
                                            <p className="text-cream/40 text-xs mb-2">
                                                {LocationLabels[item.preferredLocation]}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gold">
                                                <span className="font-mono">{item.quantity} bags</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-gold/10 space-y-4">
                                <div>
                                    <label className="text-sm text-cream/60 mb-1.5 block">
                                        Approx. Target Date (Optional)
                                    </label>
                                    <Input
                                        type="date"
                                        value={targetDate}
                                        onChange={(e) => setTargetDate(e.target.value)}
                                        className="input-premium"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-cream/60 mb-1.5 block">
                                        Message (Optional)
                                    </label>
                                    <Textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Any specific requirements?"
                                        className="input-premium min-h-[80px]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {!success && items.length > 0 && (
                    <SheetFooter className="border-t border-gold/10 pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full btn-premium"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Inquiry ({items.length} items)
                                </>
                            )}
                        </Button>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
