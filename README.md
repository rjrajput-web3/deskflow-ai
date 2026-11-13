# DeskFlow AI — Your Business Never Misses a Customer

> **Try the live interactive WhatsApp demo:** https://deskflow-receptionist.vercel.app/ — chat with the AI receptionist, book a test appointment, and see it work before you buy.
>
> **Live site:** https://deskflowai-tau.vercel.app/

DeskFlow AI is a WhatsApp AI receptionist for small businesses. It answers customers instantly, takes bookings, answers questions about services, prices and hours, and hands over to a human when needed.

## What it does

- Instant WhatsApp replies, 24/7, in the business's own voice
- Provisional bookings with a simulated calendar (staff confirm each booking)
- Answers about services, prices, opening hours and availability
- Human handoff when a customer asks for a person
- Works for clinics, salons, real estate, hotels, restaurants and more

The live demo ships with four sample businesses (Oakridge Dental Studio, Harborview Realty, Velour Salon & Spa, Kinetix Gear) plus a custom-business builder, so you can see it working for your own trade in minutes.

## The n8n template

The full 29-node n8n workflow behind DeskFlow is available as a one-time template for **$9** on Gumroad: https://smartstartguideshq.gumroad.com/l/deskflow-whatsapp-receptionist

## Tech

Next.js + TypeScript, deployed on Vercel. The on-site `/demo` is an interactive simulation; the live WhatsApp Cloud API integration runs through a webhook (`/api/webhooks/whatsapp`) and needs your own Meta credentials to connect.

## Run it locally

```bash
npm install
npm run dev
```

## License

MIT
