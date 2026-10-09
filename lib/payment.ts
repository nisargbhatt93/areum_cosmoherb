import Razorpay from 'razorpay'

// Fallback logic in case API keys are not provided
// We allow the application to proceed gracefully using a mock ID in sandbox scenarios.
export async function createRazorpayOrder(amount: number, receiptId: string) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('[Razorpay] Missing API keys. Using mock order.')
    return {
      id: `order_mock_${Date.now()}_${receiptId}`,
      amount: amount * 100,
      currency: 'INR',
      receipt: receiptId,
      status: 'created',
    }
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })

  // Amount in paise (multiply by 100)
  const options = {
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: receiptId,
  }

  try {
    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error('[Razorpay] Error creating order:', error)
    throw error
  }
}
