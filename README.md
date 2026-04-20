# BAO Étiquettes

Web app for printing DLC labels across the 8 BAO restaurants.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Deploy

Same pattern as the DLC label app:

```bash
npx vercel
```

Answer the prompts, get a public URL (e.g. `bao-tickets.vercel.app`) that the kitchen iPad can bookmark.

## Flow

1. Pick a restaurant (8 total)
2. Pick a category (Bao, Sauces, Farces, Viandes)
3. Pick a product
4. Preview the ticket, choose quantity, tap **Imprimer**

The browser's print dialog opens. With an AirPrint-capable thermal printer on the same Wi-Fi, it prints at 80mm.

## Two ticket templates

Chosen automatically based on the product:

- **Fresh** (0°C to 3°C) — restaurant name as header, DF + DLC side by side
- **Frozen** (-18°C to -25°C) — product name as header, stacked rows

For most restaurants, BAO products are thawed and go on the fresh ticket. At Gros Bao Marseille and Petit Bao Bastille (BAO EXPRESS), they stay frozen.

## Edit the catalog

Everything lives in `src/App.jsx`:

- `RESTAURANTS` — the 8 sites. A restaurant with a `variantKey` (`marseille`, `bao-express`) will see its own variant of products that define one.
- `PRODUCTS` — each product has a `category` and one or more `variants`. Each variant sets `dlc` (`{ days: N }` or `{ months: N }`) and `frozen` (`true` = frozen ticket).

To add a product:

```js
{ name: 'Sauce truffe (4kg)', category: 'Sauces', variants: {
    default: { dlc: { months: 1 }, frozen: false }
}},
```

Products without DLC info in the source catalog are simply not added — the app can't ticket them.

## Print quality check

Before going live, print a real ticket from Safari on iPad to the target printer and compare to the existing BAO templates. The `@page { size: 80mm auto }` rule should make it come out the right width, but iOS Safari + AirPrint has occasional quirks with non-A4 sizes. Worth a real-world test.
