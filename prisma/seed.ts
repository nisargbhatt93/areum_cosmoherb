import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing old data...')
  await prisma.inventoryTransaction.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.shipment.deleteMany()
  await prisma.couponUsage.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.review.deleteMany()
  await prisma.productIngredient.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.ingredient.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.storeSettings.deleteMany()
  await prisma.adminUser.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding store settings...')
  await prisma.storeSettings.createMany({
    data: [
      { key: 'store_name', value: 'Areum Cosmoherb' },
      { key: 'free_shipping_threshold', value: '999' },
      { key: 'base_shipping_fee', value: '60' },
      { key: 'cod_fee', value: '40' },
      { key: 'cod_enabled', value: 'true' },
      { key: 'support_email', value: 'care@areumcosmoherb.com' },
      { key: 'support_phone', value: '+91 98765 43210' },
      { key: 'announcement_bar', value: 'Free Shipping on Orders Above ₹999 | Use code AREUM10' },
    ],
  })

  console.log('Seeding admin...')
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  await prisma.adminUser.create({
    data: {
      name: 'Super Admin',
      email: 'admin@areumcosmoherb.com',
      password: adminPassword,
      role: 'super_admin',
      isActive: true,
    },
  })

  console.log('Seeding test customer...')
  const customerPassword = await bcrypt.hash('Customer@123', 10)
  const testCustomer = await prisma.user.create({
    data: {
      name: 'Aditi Sharma',
      email: 'aditi@example.com',
      phone: '9876543210',
      password: customerPassword,
      role: 'customer',
      addresses: {
        create: {
          name: 'Aditi Sharma',
          phone: '9876543210',
          line1: 'Flat 402, Lotus Residency, MG Road',
          line2: 'Near Central Mall',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India',
          isDefault: true,
        },
      },
    },
  })

  console.log('Seeding categories...')
  const hairCare = await prisma.category.create({
    data: {
      name: 'Hair Care',
      slug: 'hair-care',
      description: 'Gentle, herbal haircare made with traditional botanical extracts.',
      sortOrder: 1,
    },
  })

  const skinCare = await prisma.category.create({
    data: {
      name: 'Skin Care',
      slug: 'skin-care',
      description: 'Nourishing skincare formulated with soothing herbs for radiant, healthy skin.',
      sortOrder: 2,
    },
  })

  const bathBody = await prisma.category.create({
    data: {
      name: 'Bath & Body',
      slug: 'bath-body',
      description: 'Refreshing bath and body essentials with natural botanical scents.',
      sortOrder: 3,
    },
  })

  const lipCare = await prisma.category.create({
    data: {
      name: 'Lip Care',
      slug: 'lip-care',
      description: 'Hydrating herbal lip balms and treatments for soft, healthy lips.',
      sortOrder: 4,
    },
  })

  const hairColor = await prisma.category.create({
    data: {
      name: 'Hair Color',
      slug: 'hair-color',
      description: 'Gentle herbal hair colors inspired by natural henna and indigo traditions.',
      sortOrder: 5,
    },
  })

  const comboPacks = await prisma.category.create({
    data: {
      name: 'Combo Packs',
      slug: 'combo-packs',
      description: 'Value gift sets and complete herbal routines crafted together.',
      sortOrder: 6,
    },
  })

  console.log('Seeding ingredients...')
  const ingAmla = await prisma.ingredient.create({
    data: {
      name: 'Amla (Indian Gooseberry)',
      slug: 'amla',
      description: 'Rich in Vitamin C and antioxidants. Traditionally used to strengthen roots and enhance natural hair shine.',
      benefits: 'Nourishes scalp, supports hair vitality, adds natural luster.',
      sortOrder: 1,
    },
  })

  const ingBhringraj = await prisma.ingredient.create({
    data: {
      name: 'Bhringraj',
      slug: 'bhringraj',
      description: 'Known as the "King of Hair" in traditional Ayurveda. Formulated to calm the scalp and support resilient hair.',
      benefits: 'Soothes dryness, promotes scalp comfort, enhances hair texture.',
      sortOrder: 2,
    },
  })

  const ingShikakai = await prisma.ingredient.create({
    data: {
      name: 'Shikakai',
      slug: 'shikakai',
      description: 'A mild natural cleanser with saponins that gently washes without stripping natural moisture.',
      benefits: 'Mild cleansing, detangles smoothly, maintains natural pH balance.',
      sortOrder: 3,
    },
  })

  const ingAloe = await prisma.ingredient.create({
    data: {
      name: 'Aloe Vera',
      slug: 'aloe-vera',
      description: 'Deeply hydrating and soothing leaf gel packed with vitamins and minerals for tender skin and hair.',
      benefits: 'Intense hydration, calms sensitive skin, locks in hydration.',
      sortOrder: 4,
    },
  })

  const ingNeem = await prisma.ingredient.create({
    data: {
      name: 'Neem',
      slug: 'neem',
      description: 'Revered for centuries for purifying and clarifying delicate skin and maintaining clear scalp hygiene.',
      benefits: 'Purifying care, clarifies impurities, relieves scalp irritation.',
      sortOrder: 5,
    },
  })

  const ingTulsi = await prisma.ingredient.create({
    data: {
      name: 'Tulsi (Holy Basil)',
      slug: 'tulsi',
      description: 'A sacred botanical adaptogen known for refreshing properties that revitalize tired skin and scalp.',
      benefits: 'Refreshes and tones, defends against environmental stress.',
      sortOrder: 6,
    },
  })

  console.log('Seeding products...')

  const p1 = await prisma.product.create({
    data: {
      name: 'Areum Kesh Herbal Shampoo with Amla & Shikakai',
      slug: 'areum-kesh-herbal-shampoo',
      sku: 'AREUM-HMP-001',
      shortDescription: 'Gentle everyday scalp cleanser enriched with pure Amla, Shikakai, and Bhringraj extracts.',
      description: 'Formulated without harsh sulfates or artificial colorants, Areum Kesh Herbal Shampoo delivers a mild, low-lather wash that cleanses hair while preserving natural moisture. Suitable for everyday use on normal to dry hair.',
      price: 449,
      mrp: 599,
      discount: 25,
      categoryId: hairCare.id,
      stock: 45,
      lowStockThreshold: 10,
      weight: 250,
      shelfLife: '24 Months',
      suitableFor: 'All hair types, ideal for sensitive scalp',
      howToUse: 'Wet hair thoroughly. Take a coin-sized amount, massage gently into scalp for 1-2 minutes to form gentle lather. Rinse thoroughly with lukewarm water.',
      precautions: 'For external use only. Avoid contact with eyes. Patch test recommended before initial use.',
      benefits: 'Gentle everyday cleansing, preserves natural oils, enhances soft shine, leaves scalp feeling calm and refreshed.',
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isTrending: true,
      badge: 'Best Seller',
      status: 'active',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&auto=format&fit=crop&q=80', isPrimary: false, sortOrder: 1 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: ingAmla.id },
          { ingredientId: ingShikakai.id },
          { ingredientId: ingBhringraj.id },
        ],
      },
    },
  })

  const p2 = await prisma.product.create({
    data: {
      name: 'Areum Botanical Nourishing Hair Conditioner',
      slug: 'areum-botanical-hair-conditioner',
      sku: 'AREUM-HCD-002',
      shortDescription: 'Rich herbal cream conditioner with Aloe Vera, Methi, and Hibiscus for smooth, manageable hair.',
      description: 'An indulgent, plant-based rinse-off conditioner that softens dry strands and tames frizz. Made with pure aloe gel and cold-pressed botanical oils to replenish moisture after washing.',
      price: 499,
      mrp: 649,
      discount: 23,
      categoryId: hairCare.id,
      stock: 38,
      lowStockThreshold: 8,
      weight: 200,
      shelfLife: '24 Months',
      suitableFor: 'Dry, frizzy, and chemically-treated hair',
      howToUse: 'After shampooing, apply along the mid-lengths and tips. Leave on for 2-3 minutes, then rinse thoroughly.',
      precautions: 'Do not apply directly to roots or scalp. Store in a cool, dry place.',
      benefits: 'Detangles effortlessly, locks in essential hydration, reduces split-end appearance, silky touch without heaviness.',
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isTrending: false,
      badge: 'Trending',
      status: 'active',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: ingAloe.id },
          { ingredientId: ingBhringraj.id },
        ],
      },
    },
  })

  const p3 = await prisma.product.create({
    data: {
      name: 'Areum Pure Neem & Tulsi Clarifying Herbal Soap',
      slug: 'areum-pure-neem-tulsi-soap',
      sku: 'AREUM-SOAP-003',
      shortDescription: 'Handcrafted cold-processed soap infused with organic Neem oil, Tulsi, and soothing coconut butter.',
      description: 'Crafted using slow artisan cold-process methods that cure for 6 weeks, this herbal bar maintains skin barrier integrity while thoroughly washing away city grime, sweat, and surface impurities.',
      price: 199,
      mrp: 249,
      discount: 20,
      categoryId: bathBody.id,
      stock: 6, // Low stock test!
      lowStockThreshold: 10,
      weight: 125,
      shelfLife: '36 Months',
      suitableFor: 'Blemish-prone, combination, and normal skin',
      howToUse: 'Lather between wet palms or with a loofah. Massage gently over wet body and face, then rinse with clean water.',
      precautions: 'Keep dry between uses in a draining soap dish to prolong soap life.',
      benefits: 'Non-drying clarifying lather, removes excess sebum, traditional herbal aroma, clean feel.',
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      isTrending: true,
      badge: 'Only 6 Left',
      status: 'active',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1607006314644-8d9620573934?w=800&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: ingNeem.id },
          { ingredientId: ingTulsi.id },
        ],
      },
    },
  })

  const p4 = await prisma.product.create({
    data: {
      name: 'Areum Natural Henna & Indigo Herbal Hair Color',
      slug: 'areum-natural-herbal-hair-color',
      sku: 'AREUM-COL-004',
      shortDescription: '100% plant-powder herbal hair coloring blend free from ammonia, PPD, peroxide, and synthetic dyes.',
      description: 'Finely ground Rajasthani Lawsonia inermis (Henna) paired with certified Indigofera tinctoria leaf powder. Yields rich, natural brown-to-dark tones while conditioning hair roots.',
      price: 379,
      mrp: 499,
      discount: 24,
      categoryId: hairColor.id,
      stock: 22,
      lowStockThreshold: 5,
      weight: 150,
      shelfLife: '24 Months',
      suitableFor: 'Natural grey coverage and lustrous herbal toning',
      howToUse: 'Mix powder with warm water in a non-metallic bowl until yogurt consistency. Apply evenly on clean damp hair. Cover with shower cap for 90-120 minutes. Rinse with water only.',
      precautions: 'Perform a 48-hour skin allergy test before application. Do not use on eyelashes or eyebrows.',
      benefits: 'Natural subtle color, herbal conditioning, gentle on scalp, no harsh chemical odors.',
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isTrending: false,
      badge: 'Natural Blend',
      status: 'active',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: ingAmla.id },
          { ingredientId: ingBhringraj.id },
        ],
      },
    },
  })

  const p5 = await prisma.product.create({
    data: {
      name: 'Areum Rose & Almond Soothing Herbal Lip Balm',
      slug: 'areum-rose-almond-lip-balm',
      sku: 'AREUM-LIP-005',
      shortDescription: 'Deeply moisturizing herbal lip butter made with damask rose extract, almond oil, and beeswax.',
      description: 'Formulated without petroleum jelly, parabens, or artificial sweeteners. Glides on smoothly to seal in comfort and give lips a naturally hydrated, healthy sheen throughout the day.',
      price: 189,
      mrp: 229,
      discount: 17,
      categoryId: lipCare.id,
      stock: 52,
      lowStockThreshold: 10,
      weight: 15,
      shelfLife: '18 Months',
      suitableFor: 'Chapped, dry, and wind-burned lips',
      howToUse: 'Dab a small quantity with fingertips onto lips as needed throughout the day and before bedtime.',
      precautions: 'Store away from direct sunlight and extreme heat.',
      benefits: 'Long-lasting hydration, prevents flakiness, subtle natural rose aroma, zero waxy residue.',
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      isTrending: false,
      badge: 'New Arrival',
      status: 'active',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: ingAloe.id },
        ],
      },
    },
  })

  const p6 = await prisma.product.create({
    data: {
      name: 'Areum Traditional Bhringraj Intensive Scalp Oil',
      slug: 'areum-traditional-bhringraj-scalp-oil',
      sku: 'AREUM-OIL-006',
      shortDescription: 'Slow-infused herbal scalp oil processed in cold-pressed sesame and virgin coconut oils.',
      description: 'Made following time-honored slow-cooking methods with 14 active herbs including Bhringraj, Brahmi, and Amla. Massaging this light, aromatic oil encourages scalp comfort and relaxation.',
      price: 599,
      mrp: 799,
      discount: 25,
      categoryId: hairCare.id,
      stock: 30,
      lowStockThreshold: 8,
      weight: 200,
      shelfLife: '24 Months',
      suitableFor: 'Stress-prone scalp, dull and dry strands',
      howToUse: 'Warm a tablespoon of oil between palms. Gently massage into scalp using circular fingertip motions. Leave on for at least 1 hour or overnight before shampooing.',
      precautions: 'For topical scalp application only.',
      benefits: 'Relaxes and calms scalp, leaves hair feeling thicker and soft, non-sticky herbal texture.',
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isTrending: true,
      badge: 'Best Seller',
      status: 'active',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1608248597359-2e0618037a50?w=800&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: ingBhringraj.id },
          { ingredientId: ingAmla.id },
        ],
      },
    },
  })

  const p7 = await prisma.product.create({
    data: {
      name: 'Areum Aloe & Green Tea Calming Face Gel',
      slug: 'areum-aloe-green-tea-face-gel',
      sku: 'AREUM-SKN-007',
      shortDescription: 'Oil-free soothing botanical moisturizer packed with cold-pressed Aloe Vera and fresh Green Tea.',
      description: 'Instantly cooling and ultra-lightweight gel that absorbs cleanly into skin without leaving any grease or shine. Helps calm redness, replenish hydration, and prep skin for daytime sunscreen.',
      price: 399,
      mrp: 499,
      discount: 20,
      categoryId: skinCare.id,
      stock: 40,
      lowStockThreshold: 8,
      weight: 100,
      shelfLife: '24 Months',
      suitableFor: 'Oily, combination, and sensitive skin in humid climates',
      howToUse: 'Smooth a nickel-sized amount over clean face and neck in upward circular strokes until fully absorbed.',
      precautions: 'Keep lid tightly closed. Store in a cool place.',
      benefits: 'Instant cooling sensation, zero pore-clogging oils, boosts natural moisture, soothing after sun exposure.',
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      isTrending: false,
      badge: 'New',
      status: 'active',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: ingAloe.id },
          { ingredientId: ingTulsi.id },
        ],
      },
    },
  })

  const p8 = await prisma.product.create({
    data: {
      name: 'Areum Complete Daily Herbal Hair Care Ritual (Combo Pack)',
      slug: 'areum-daily-herbal-hair-care-ritual',
      sku: 'AREUM-CMB-008',
      shortDescription: 'Complete 3-step hair ritual: Herbal Shampoo (250ml) + Nourishing Conditioner (200ml) + Bhringraj Oil (100ml).',
      description: 'The ultimate botanical hair wellness set. Includes our three most popular herbal formulations bundled together with an exclusive savings of 30% over individual items.',
      price: 1199,
      mrp: 1747,
      discount: 31,
      categoryId: comboPacks.id,
      stock: 18,
      lowStockThreshold: 5,
      weight: 650,
      shelfLife: '24 Months',
      suitableFor: 'Complete weekly hair restoration ritual',
      howToUse: 'Step 1: Apply Bhringraj Oil 1 hr before bath. Step 2: Wash with Kesh Shampoo. Step 3: Condition lengths for 2 mins & rinse.',
      precautions: 'See individual packaging for specific precautions.',
      benefits: 'Save 31% over individual items, complete routine, complimentary eco-gift pouch included.',
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isTrending: true,
      badge: 'Best Value',
      status: 'active',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: ingAmla.id },
          { ingredientId: ingBhringraj.id },
          { ingredientId: ingAloe.id },
          { ingredientId: ingShikakai.id },
        ],
      },
    },
  })

  console.log('Seeding reviews...')
  await prisma.review.createMany({
    data: [
      {
        productId: p1.id,
        name: 'Pooja Iyer',
        rating: 5,
        title: 'Finally a mild shampoo that works!',
        body: 'I have an easily irritated scalp and typical store shampoos always made it itchy. Areum shampoo is wonderfully gentle and leaves my hair soft without stripping.',
        isVerified: true,
        isFeatured: true,
        status: 'approved',
      },
      {
        productId: p1.id,
        name: 'Rohan Mehra',
        rating: 5,
        title: 'Subtle herbal fragrance, great wash',
        body: 'Cleans off daily grime and sweat easily without synthetic smells. Very pleasant and leaves hair feeling naturally light.',
        isVerified: true,
        isFeatured: false,
        status: 'approved',
      },
      {
        productId: p2.id,
        name: 'Shreya Sen',
        rating: 4,
        title: 'Very hydrating on mid-lengths',
        body: 'Great consistency and softens dry frizzy ends nicely. A little goes a long way.',
        isVerified: true,
        isFeatured: true,
        status: 'approved',
      },
      {
        productId: p3.id,
        name: 'Vikram Joshi',
        rating: 5,
        title: 'Authentic neem soap',
        body: 'You can feel the pure herbal quality in the soap lather. Really good for hot summers.',
        isVerified: true,
        isFeatured: true,
        status: 'approved',
      },
      {
        productId: p6.id,
        name: 'Deepika Nair',
        rating: 5,
        title: 'Authentic Bhringraj formulation',
        body: 'Massaging this oil weekly has become my Sunday ritual. So calming after a hectic work week.',
        isVerified: true,
        isFeatured: true,
        status: 'approved',
      },
      {
        productId: p8.id,
        name: 'Manish Rawat',
        rating: 5,
        title: 'Gifted this combo to my family',
        body: 'Beautiful packaging, lovely herbal scents, and genuine value. Will reorder again for sure!',
        isVerified: true,
        isFeatured: true,
        status: 'approved',
      },
    ],
  })

  console.log('Seeding coupons...')
  const now = new Date()
  const nextYear = new Date()
  nextYear.setFullYear(now.getFullYear() + 1)

  await prisma.coupon.createMany({
    data: [
      {
        code: 'AREUM10',
        description: '10% off your entire order with no minimum spend',
        type: 'percentage',
        value: 10,
        maxDiscount: 200,
        minOrderAmount: 0,
        startDate: now,
        expiryDate: nextYear,
        isFirstOrderOnly: false,
        isCodAllowed: true,
        isActive: true,
      },
      {
        code: 'WELCOME10',
        description: '10% off for first-time customers',
        type: 'percentage',
        value: 10,
        maxDiscount: 300,
        minOrderAmount: 499,
        startDate: now,
        expiryDate: nextYear,
        isFirstOrderOnly: true,
        isCodAllowed: true,
        isActive: true,
      },
      {
        code: 'SAVE200',
        description: 'Flat ₹200 off on orders above ₹1,499',
        type: 'fixed',
        value: 200,
        minOrderAmount: 1499,
        startDate: now,
        expiryDate: nextYear,
        isFirstOrderOnly: false,
        isCodAllowed: true,
        isActive: true,
      },
    ],
  })

  console.log('Seeding sample orders...')
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'AC-DEMO-1001',
      userId: testCustomer.id,
      shippingAddress: JSON.stringify({
        name: 'Aditi Sharma',
        phone: '9876543210',
        line1: 'Flat 402, Lotus Residency, MG Road',
        line2: 'Near Central Mall',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India',
      }),
      subtotal: 948,
      discount: 95,
      couponCode: 'AREUM10',
      shippingFee: 0,
      tax: 0,
      total: 853,
      paymentMethod: 'razorpay',
      paymentStatus: 'completed',
      status: 'shipped',
      expectedDelivery: new Date(Date.now() + 3 * 86400000),
      items: {
        create: [
          {
            productId: p1.id,
            productName: p1.name,
            sku: p1.sku,
            quantity: 1,
            price: 449,
            mrp: 599,
            discount: 150,
            total: 449,
          },
          {
            productId: p2.id,
            productName: p2.name,
            sku: p2.sku,
            quantity: 1,
            price: 499,
            mrp: 649,
            discount: 150,
            total: 499,
          },
        ],
      },
      payment: {
        create: {
          amount: 853,
          currency: 'INR',
          method: 'razorpay',
          status: 'completed',
          gatewayOrderId: 'order_mock_9921',
          gatewayPaymentId: 'pay_mock_8812',
        },
      },
      shipment: {
        create: {
          courier: 'Blue Dart Express',
          trackingNumber: 'BLUEDART-88291039',
          trackingUrl: 'https://www.bluedart.com',
          status: 'shipped',
          estimatedDate: new Date(Date.now() + 3 * 86400000),
          notes: 'Package picked up from warehouse, in transit to Bengaluru hub.',
        },
      },
    },
  })

  console.log(`Database seeded successfully! Demo Order: ${sampleOrder.orderNumber}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
