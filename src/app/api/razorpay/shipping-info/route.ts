export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ShippingAddress = {
  id?: string | number;
  zipcode?: string;
  state_code?: string;
  country?: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const addresses = Array.isArray(body?.addresses) ? body.addresses as ShippingAddress[] : [];

    if (!addresses.length) {
      return Response.json({ error: "At least one delivery address is required." }, { status: 400 });
    }

    const responseAddresses = addresses.map((address) => {
      const zipcode = String(address?.zipcode ?? "").trim();
      const country = String(address?.country ?? "IN").trim().toUpperCase();
      const validIndianPincode = country === "IN" && /^[1-9]\d{5}$/.test(zipcode);

      return {
        id: String(address?.id ?? ""),
        zipcode,
        ...(address?.state_code ? { state_code: String(address.state_code) } : {}),
        country,
        shipping_methods: [
          {
            id: "little-basket-free-delivery",
            name: "Free Delivery",
            description: "Free delivery on orders within India",
            serviceable: validIndianPincode,
            shipping_fee: 0,
            cod: false,
            cod_fee: 0,
          },
        ],
      };
    });

    return Response.json(
      { addresses: responseAddresses },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Invalid shipping information request." }, { status: 400 });
  }
}

export async function GET() {
  return Response.json({
    service: "Little Basket Razorpay shipping information",
    shipping_fee: 0,
    cod: false,
    message: "POST a Razorpay Magic Checkout shipping information request.",
  });
}
