import { useState } from 'react';

const AGREMENT = 'FR 94.081.009 CE';

const RESTAURANTS = [
  { id: 'petit-bao-em',       name: 'Petit Bao EM',        ticketName: 'PETIT BAO EM' },
  { id: 'gros-bao-paris',     name: 'Gros Bao Paris',      ticketName: 'GROS BAO PARIS' },
  { id: 'bleu-bao',           name: 'Bleu Bao',            ticketName: 'BLEU BAO' },
  { id: 'petit-bao-bastille', name: 'Petit Bao Bastille',  ticketName: 'BAO EXPRESS',         variantKey: 'bao-express' },
  { id: 'gros-bao-marseille', name: 'Gros Bao Marseille',  ticketName: 'GROS BAO MARSEILLE',  variantKey: 'marseille' },
  { id: 'petit-bao-fsd',      name: 'Petit Bao FSD',       ticketName: 'PETIT BAO FSD' },
  { id: 'petit-bao-ternes',   name: 'Petit Bao Ternes',    ticketName: 'PETIT BAO TERNES' },
  { id: 'petit-bao-bercy',    name: 'Petit Bao Bercy',     ticketName: 'PETIT BAO BERCY' },
];

// Each variant sets:
//   dlc:    { days: N } or { months: N }  (rule applied to fabrication date)
//   frozen: true|false   (selects ticket template when user picks Shipping flow)
// Products that are marked "ETIQUETTE SIMPLE BAC" in the source sheet are not
// in this list at all — they don't get product tickets.
const PRODUCTS = [
  // --- BAO ---
  { name: 'Baozi charsiu',   category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { days: 5 }, frozen: true  },
  }},
  { name: 'Baozi shanghai',  category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { days: 5 }, frozen: true  },
  }},
  { name: 'Baozi chicken',   category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { days: 5 }, frozen: true  },
  }},
  { name: 'Baozi veggie',    category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { days: 5 }, frozen: true  },
  }},
  { name: 'Baozi boeuf',     category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { days: 5 }, frozen: true  },
  }},
  { name: 'Baozi fromage',   category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { days: 5 }, frozen: true  },
  }},
  { name: 'Mini baozi porc', category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { days: 5 }, frozen: true  },
      'bao-express': { dlc: { days: 5 }, frozen: true  },
  }},
  { name: 'Gua bao',         category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
  }},
  { name: 'Bao choco',       category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { days: 5 }, frozen: true  },
  }},
  { name: 'Peanut bao',      category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { days: 5 }, frozen: true  },
  }},

  // --- Dim Sum ---
  { name: 'Siu mai',              category: 'Dim Sum', variants: { default: { dlc: { months: 2 }, frozen: true } }},
  { name: 'Siu mai crevette',     category: 'Dim Sum', variants: { default: { dlc: { months: 2 }, frozen: true } }},
  { name: 'Crystal dumpling',     category: 'Dim Sum', variants: { default: { dlc: { months: 2 }, frozen: true } }},
  { name: 'Spring rolls crevette',category: 'Dim Sum', variants: { default: { dlc: { months: 2 }, frozen: true } }},
  { name: 'Wontons',              category: 'Dim Sum', variants: { default: { dlc: { months: 2 }, frozen: true } }},
  { name: 'Veggie wontons',       category: 'Dim Sum', variants: { default: { dlc: { months: 2 }, frozen: true } }},
  { name: 'Lava coconut pearls',  category: 'Dim Sum', variants: { default: { dlc: { months: 2 }, frozen: true } }},

  // --- Sauces ---
  { name: 'Red oil (4kg)',                 category: 'Sauces', variants: { default: { dlc: { days: 7 },   frozen: false } }},
  { name: 'Sauce shanghai noodles (4kg)',  category: 'Sauces', variants: { default: { dlc: { days: 7 },   frozen: false } }},
  { name: 'Sauce S&S (4kg)',               category: 'Sauces', variants: { default: { dlc: { months: 1 }, frozen: false } }},
  { name: 'Sauce XO végétal (4kg)',        category: 'Sauces', variants: { default: { dlc: { days: 7 },   frozen: false } }},
  { name: 'Sauce haricot (2kg)',           category: 'Sauces', variants: { default: { dlc: { days: 3 },   frozen: false } }},
  { name: 'Sauce Dong Po (4kg)',           category: 'Sauces', variants: { default: { dlc: { months: 2 }, frozen: true  } }},
  { name: 'Sauce charsiu (4kg)',           category: 'Sauces', variants: {
      default:       { dlc: { months: 1 }, frozen: false },
      marseille:     { dlc: { months: 2 }, frozen: true  },
  }},
  { name: 'Marinade concombre (4kg)',      category: 'Sauces', variants: { default: { dlc: { months: 1 }, frozen: false } }},
  { name: 'Marinade aubergine (4kg)',      category: 'Sauces', variants: { default: { dlc: { months: 1 }, frozen: false } }},

  // --- Farces ---
  { name: 'Farce XLB porc (500g)',    category: 'Farces', variants: { default: { dlc: { days: 3 }, frozen: false } }},
  { name: 'Gelée (1kg)',              category: 'Farces', variants: { default: { dlc: { days: 3 }, frozen: false } }},
  { name: 'Farce shrimp (0,5kg)',     category: 'Farces', variants: { default: { dlc: { days: 3 }, frozen: false } }},
  { name: 'Chaomian homemade (1kg)',  category: 'Farces', variants: { default: { dlc: { days: 3 }, frozen: false } }},

  // --- Viandes ---
  { name: 'Dong po (en kg)',           category: 'Viandes', variants: { default: { dlc: { months: 2 }, frozen: true } }},
  { name: 'Poitrine charsiu (1kg)',    category: 'Viandes', variants: {
      default:       { dlc: { days: 3 },   frozen: false },
      marseille:     { dlc: { months: 2 }, frozen: true  },
  }},
  { name: 'Poulet frit (4kg)',         category: 'Viandes', variants: { default: { dlc: { months: 2 }, frozen: true } }},
];

const TICKET_TYPES = [
  { id: 'bac',      title: 'Identification bac',   subtitle: 'Nom du restaurant + date' },
  { id: 'receipt',  title: 'Étiquette produit',    subtitle: 'Produit' },
  { id: 'shipping', title: 'Étiquette sous-vide', subtitle: 'Nom de la recette / date fabrication / DLC' },
];

// ============================================================
// HELPERS
// ============================================================

function productsForRestaurant(restaurant) {
  const key = restaurant.variantKey || 'default';
  return PRODUCTS
    .map(p => {
      const v = p.variants[key] || p.variants.default;
      return v ? { name: p.name, category: p.category, ...v } : null;
    })
    .filter(p => p && p.dlc);
}

function addDlc(date, rule) {
  const d = new Date(date);
  if (rule.days)   d.setDate(d.getDate()   + rule.days);
  if (rule.months) d.setMonth(d.getMonth() + rule.months);
  return d;
}

const fr        = d => d.toLocaleDateString('fr-FR');
const toInput   = d => d.toISOString().slice(0, 10);
const fromInput = s => new Date(s + 'T00:00:00');

// ============================================================
// TICKET TEMPLATES
// ============================================================

function BacTicket({ restaurant, today }) {
  return (
    <div className="ticket ticket-bac">
      <div className="ticket-bac-name">{restaurant.ticketName}</div>
      <div className="ticket-bac-date">{fr(today)}</div>
    </div>
  );
}

function ReceiptTicket({ restaurant, product, today, dlc }) {
  return (
    <div className="ticket ticket-receipt">
      <div className="ticket-header">{restaurant.ticketName}</div>
      <div className="ticket-product">{product.name}</div>
      <div className="ticket-conservation">
        A CONSERVER ENTRE 0°C ET 3°C OU -18°C POUR LES PRODUITS SURGELES
      </div>
      <div className="ticket-dates">
        <div className="ticket-date-cell ticket-date-left">
          <div className="ticket-date-label">DF (date de fabrication)</div>
          <div className="ticket-date-value">{fr(today)}</div>
        </div>
        <div className="ticket-date-cell">
          <div className="ticket-date-label">DLC (date limite de consommation)</div>
          <div className="ticket-date-value">{fr(dlc)}</div>
        </div>
      </div>
      <div className="ticket-agrement">
        <div className="ticket-agrement-label">N° AGREMENT</div>
        <div className="ticket-agrement-value">{AGREMENT}</div>
      </div>
    </div>
  );
}

function ShippingTicket({ product, today, dlc }) {
  return (
    <div className="ticket ticket-shipping">
      <div className="ticket-header">{product.name.toUpperCase()}</div>
      <div className="ticket-row"><strong>PRODUIT LE :</strong> {fr(today)}</div>
      <div className="ticket-row"><strong>DLC :</strong> {fr(dlc)}</div>
      <div className="ticket-row"><strong>N° AGREMENT :</strong> {AGREMENT}</div>
      <div className="ticket-conservation-frozen">
        A CONSERVER ENTRE<br/>-18°C ET -25°C
      </div>
    </div>
  );
}

function TicketCopies({ type, restaurant, product, today, dlc, quantity }) {
  const copies = Array.from({ length: quantity });
  if (type === 'bac') {
    return <>{copies.map((_, i) =>
      <BacTicket key={i} restaurant={restaurant} today={today} />
    )}</>;
  }
  if (type === 'receipt') {
    return <>{copies.map((_, i) =>
      <ReceiptTicket key={i} restaurant={restaurant} product={product} today={today} dlc={dlc} />
    )}</>;
  }
  return <>{copies.map((_, i) =>
    <ShippingTicket key={i} product={product} today={today} dlc={dlc} />
  )}</>;
}

// ============================================================
// APP
// ============================================================

export default function App() {
  const [type,       setType]       = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [category,   setCategory]   = useState(null);
  const [product,    setProduct]    = useState(null);
  const [quantity,   setQuantity]   = useState(1);
  const [fabDate,    setFabDate]    = useState('');
  const [dlcDate,    setDlcDate]    = useState('');

  function resetAll() {
    setType(null); setRestaurant(null); setCategory(null);
    setProduct(null); setQuantity(1); setFabDate(''); setDlcDate('');
  }

  function pickProduct(p) {
    setProduct(p);
    setQuantity(1);
    const today = new Date();
    setFabDate(toInput(today));
    setDlcDate(toInput(addDlc(today, p.dlc)));
  }

  // ---------- Screen 0: ticket type ----------
  if (!type) {
    return (
      <div className="screen no-print">
        <h1>Quel type d'étiquette ?</h1>
        <div className="grid">
          {TICKET_TYPES.map(t => (
            <button key={t.id} className="card-btn big" onClick={() => setType(t.id)}>
              <div className="card-title">{t.title}</div>
              <div className="card-subtitle">{t.subtitle}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------- Screen 1: restaurant ----------
  if (!restaurant) {
    return (
      <div className="screen no-print">
        <button className="back-btn" onClick={resetAll}>← Retour</button>
        <div className="breadcrumb">{TICKET_TYPES.find(t => t.id === type).title}</div>
        <h1>Choisir un restaurant</h1>
        <div className="grid">
          {RESTAURANTS.map(r => (
            <button key={r.id} className="card-btn" onClick={() => setRestaurant(r)}>
              {r.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------- BAC FLOW (short-circuits here) ----------
  if (type === 'bac') {
    const today = new Date();
    return (
      <>
        <div className="screen no-print">
          <button className="back-btn" onClick={() => setRestaurant(null)}>← Retour</button>
          <div className="breadcrumb">Identification bac · {restaurant.name}</div>
          <h1>Aperçu de l'étiquette</h1>
          <div className="ticket-preview">
            <TicketCopies type="bac" restaurant={restaurant} today={today} quantity={1} />
          </div>

          <div className="qty-row">
            <label>Quantité :</label>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
            <span className="qty-value">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          <button className="print-btn" onClick={() => window.print()}>
            Imprimer {quantity} {quantity > 1 ? 'étiquettes' : 'étiquette'}
          </button>
        </div>

        <div className="print-only">
          <TicketCopies type="bac" restaurant={restaurant} today={today} quantity={quantity} />
        </div>
      </>
    );
  }

  // ---------- Product picker (Receipt + Shipping share this) ----------
  const products = productsForRestaurant(restaurant);
  const categories = [...new Set(products.map(p => p.category))];

  if (!category) {
    return (
      <div className="screen no-print">
        <button className="back-btn" onClick={() => setRestaurant(null)}>← Retour</button>
        <div className="breadcrumb">
          {TICKET_TYPES.find(t => t.id === type).title} · {restaurant.name}
        </div>
        <h1>Choisir une catégorie</h1>
        <div className="grid">
          {categories.map(c => (
            <button key={c} className="card-btn" onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      </div>
    );
  }

  if (!product) {
    const list = products.filter(p => p.category === category);
    return (
      <div className="screen no-print">
        <button className="back-btn" onClick={() => setCategory(null)}>← Retour</button>
        <div className="breadcrumb">
          {TICKET_TYPES.find(t => t.id === type).title} · {restaurant.name} · {category}
        </div>
        <h1>Choisir un produit</h1>
        <div className="grid">
          {list.map(p => (
            <button key={p.name} className="card-btn" onClick={() => pickProduct(p)}>
              {p.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------- Final screen: preview + dates + quantity + print ----------
  const today = fromInput(fabDate);
  const dlc   = fromInput(dlcDate);

  return (
    <>
      <div className="screen no-print">
        <button className="back-btn" onClick={() => setProduct(null)}>← Retour</button>
        <div className="breadcrumb">
          {TICKET_TYPES.find(t => t.id === type).title} · {restaurant.name} · {category} · {product.name}
        </div>

        <h1>Aperçu de l'étiquette</h1>
        <div className="ticket-preview">
          <TicketCopies
            type={type}
            restaurant={restaurant}
            product={product}
            today={today}
            dlc={dlc}
            quantity={1}
          />
        </div>

        <div className="date-row">
          <div className="date-field">
            <label>Date de fabrication</label>
            <input
              type="date"
              value={fabDate}
              onChange={e => setFabDate(e.target.value)}
            />
          </div>
          <div className="date-field">
            <label>DLC</label>
            <input
              type="date"
              value={dlcDate}
              onChange={e => setDlcDate(e.target.value)}
            />
          </div>
          <button
            className="reset-btn"
            onClick={() => {
              const t = new Date();
              setFabDate(toInput(t));
              setDlcDate(toInput(addDlc(t, product.dlc)));
            }}
          >
            Réinitialiser
          </button>
        </div>

        <div className="qty-row">
          <label>Quantité :</label>
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
          <span className="qty-value">{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>+</button>
        </div>

        <button className="print-btn" onClick={() => window.print()}>
          Imprimer {quantity} {quantity > 1 ? 'étiquettes' : 'étiquette'}
        </button>
      </div>

      <div className="print-only">
        <TicketCopies
          type={type}
          restaurant={restaurant}
          product={product}
          today={today}
          dlc={dlc}
          quantity={quantity}
        />
      </div>
    </>
  );
}