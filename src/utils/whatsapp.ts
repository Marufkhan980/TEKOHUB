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
        `${idx + 1}. *${item.product.title}*${
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
      ? `\n*TrxID:* ${payment.transactionId || 'N/A'}\n*Sender No:* ${payment.senderNumber || 'N/A'}`
      : '\n*Note:* Pay cash upon delivery';

  return `*🛒 NEW ORDER - ${storeName}*
----------------------------------------
*Order ID:* #${orderId}
*Date:* ${new Date().toLocaleDateString('en-GB')}

*📦 Items Ordered:*
${itemLines}

----------------------------------------
*Subtotal:* ৳${subtotal.toLocaleString()}
*Delivery Charge (${customer.deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):* ৳${deliveryCharge}
*Total Payable:* ৳${total.toLocaleString()}

*💳 Payment Details:*
*Method:* ${paymentMethodLabel}${paymentExtra}

*👤 Customer Info:*
*Name:* ${customer.name}
*Phone:* ${customer.phone}
*Address:* ${customer.address}
${customer.notes ? `*Delivery Notes:* ${customer.notes}\n` : ''}----------------------------------------
Please confirm my order and send the delivery tracking details. Thank you!`;
}

export function generateWhatsAppOrderUrl(whatsappNumber: string, message: string): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function generateFacebookMessengerUrl(facebookUrlOrHandle: string = 'https://www.facebook.com/tekohub99/'): string {
  // Extract handle from URL if needed
  if (facebookUrlOrHandle.includes('facebook.com/')) {
    const handleMatch = facebookUrlOrHandle.replace(/\/+$/, '').split('facebook.com/')[1]?.split('/')[0];
    if (handleMatch) {
      return `https://m.me/${handleMatch}`;
    }
  }
  return 'https://m.me/tekohub99';
}

export function formatQuickProductInquiry(product: Product, whatsappNumber: string): string {
  const message = `Hello TEKOHUB! 👋
I would like to order / inquire about:
*${product.title}*
Price: ৳${product.price.toLocaleString()}
Link: ${window.location.origin}#${product.slug}

Is this product available for delivery?`;

  return generateWhatsAppOrderUrl(whatsappNumber, message);
}

// Backward compatibility alias
export const formatWhatsAppOrderMessage = formatOrderSummaryMessage;
