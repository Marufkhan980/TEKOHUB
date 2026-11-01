import { CartItem, CustomerInfo, PaymentDetails, Product } from '../types';

export function formatOrderSummaryMessage({
  orderId,
  items,
  customer,
  payment,
  deliveryCharge,
  subtotal,
  total,
  storeName = 'TEKOHUB'
}: {
  orderId: string;
  items: CartItem[];
  customer: CustomerInfo;
  payment: PaymentDetails;
  deliveryCharge: number;
  subtotal: number;
  total: number;
  storeName?: string;
}): string {
  const itemLines = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.title}${
          item.selectedColor ? ` [Color: ${item.selectedColor}]` : ''
        } x ${item.quantity} = ৳${(item.product.price * item.quantity).toLocaleString()}`
    )
    .join('\n');

  const paymentMethodLabel =
    payment.method === 'bkash'
      ? 'bKash (Send Money)'
      : payment.method === 'nagad'
      ? 'Nagad (Send Money)'
      : payment.method === 'rocket'
      ? 'Rocket (Send Money)'
      : 'Cash on Delivery (COD)';

  const paymentExtra =
    payment.method !== 'cod'
      ? `\nTrxID: ${payment.transactionId || 'N/A'}\nSender No: ${payment.senderNumber || 'N/A'}`
      : '\nNote: Pay cash upon delivery';

  return `◈ NEW ORDER - ${storeName}
----------------------------------
Order ID: #${orderId}
Date: ${new Date().toLocaleDateString('en-GB')}

◈ Items Ordered:
${itemLines}

----------------------------------
Subtotal: ৳${subtotal.toLocaleString()}
Delivery Charge (${customer.deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}): ৳${deliveryCharge}
Total Payable: ৳${total.toLocaleString()}

◈ Payment Details:
Method: ${paymentMethodLabel}${paymentExtra}

◈ Customer Info:
Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}${customer.notes ? `\nDelivery Notes: ${customer.notes}` : ''}

Please confirm my order and send the delivery tracking details. Thank you!`;
}

export function generateWhatsAppOrderUrl(whatsappNumber: string, message: string): string {
  const cleanNumber = (whatsappNumber || '8801572923121').replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function generateFacebookMessengerUrl(facebookUrlOrHandle: string = 'https://www.facebook.com/tekohub99/'): string {
  if (!facebookUrlOrHandle) return 'https://m.me/tekohub99';
  if (facebookUrlOrHandle.includes('facebook.com/')) {
    const handleMatch = facebookUrlOrHandle.replace(/\/+$/, '').split('facebook.com/')[1]?.split('/')[0]?.split('?')[0];
    if (handleMatch && handleMatch !== 'profile.php') {
      return `https://m.me/${handleMatch}`;
    }
  }
  return 'https://m.me/tekohub99';
}

export function formatSingleProductOrderMessage({
  product,
  quantity = 1,
  selectedColor,
  storeName = 'TEKOHUB'
}: {
  product: Product;
  quantity?: number;
  selectedColor?: string;
  storeName?: string;
}): string {
  const total = product.price * quantity;
  return `◈ NEW ORDER INQUIRY - ${storeName}
----------------------------------
Date: ${new Date().toLocaleDateString('en-GB')}

◈ Product Details:
1. ${product.title}${selectedColor ? ` [Color: ${selectedColor}]` : ''} x ${quantity} = ৳${total.toLocaleString()}

----------------------------------
Price: ৳${total.toLocaleString()}
${product.warranty ? `Warranty: ${product.warranty}\n` : ''}Stock Status: ${product.inStock ? 'Available' : 'Out of stock'}

Please confirm my order and send delivery options. Thank you!`;
}

export function formatCartOrderMessage({
  items,
  subtotal,
  deliveryCharge,
  total,
  deliveryArea = 'dhaka',
  storeName = 'TEKOHUB'
}: {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  deliveryArea?: 'dhaka' | 'outside';
  storeName?: string;
}): string {
  const itemLines = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.title}${
          item.selectedColor ? ` [Color: ${item.selectedColor}]` : ''
        } x ${item.quantity} = ৳${(item.product.price * item.quantity).toLocaleString()}`
    )
    .join('\n');

  return `◈ CART ORDER - ${storeName}
----------------------------------
Date: ${new Date().toLocaleDateString('en-GB')}

◈ Items Ordered:
${itemLines}

----------------------------------
Subtotal: ৳${subtotal.toLocaleString()}
Delivery Charge (${deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}): ৳${deliveryCharge}
Total Payable: ৳${total.toLocaleString()}

Please confirm my order and let me know the payment details. Thank you!`;
}

export const formatWhatsAppOrderMessage = formatOrderSummaryMessage;
export const formatQuickProductInquiry = formatSingleProductOrderMessage;
