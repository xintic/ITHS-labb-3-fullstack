import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { LuShoppingCart } from 'react-icons/lu';

const Cart = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" onClick={() => setOpen(!open)} aria-label="Visa kundvagn">
          <LuShoppingCart className="mr-2" /> Kundvagn
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <h3 className="text-lg font-semibold mb-2">Din kundvagn</h3>
        <p className="text-sm text-muted-foreground">Din varukorg är tom.</p>
        {/* Här kan du i framtiden rendera cartItems med map() */}
      </PopoverContent>
    </Popover>
  );
};

export default Cart;
