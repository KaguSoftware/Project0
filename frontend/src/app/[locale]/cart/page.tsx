import CartProductGrid from "@/src/components/cart/cartproducts";
import { CARTPRODUCTS } from "@/src/components/cards/CartProduct/constants";

export default function CartPage() {
    return (
        <main className="md:p-4 py-4">
            <CartProductGrid cartproducts={CARTPRODUCTS} />
        </main>
    );
}
