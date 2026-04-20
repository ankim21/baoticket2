import { useState } from 'react';
// ============================================================
// DATA
// ============================================================

const AGREMENT = 'FR 94.081.009 CE';

// Each restaurant has an optional `variantKey` used to pick the right
// product variant. Marseille and Bastille keep certain BAO products frozen
// rather than thawed, so they have their own variants.
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

// Each product has one or more variants. `default` covers every restaurant
// unless that restaurant has its own key. A variant holds the DLC rule and
// whether it's frozen (which picks the ticket template).
// Products without any DLC in the catalog are simply not listed here.
const PRODUCTS = [
  // --- BAO ---
  { name: 'Baozi charsiu',   category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { months: 2 }, frozen: true  },
  }},
  { name: 'Baozi shanghai',  category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { months: 2 }, frozen: true  },
  }},
  { name: 'Baozi chicken',   category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { months: 2 }, frozen: true  },
  }},
  { name: 'Baozi veggie',    category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { months: 2 }, frozen: true  },
  }},
  { name: 'Baozi boeuf',     category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { months: 2 }, frozen: true  },
  }},
  { name: 'Baozi fromage',   category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { months: 2 }, frozen: true  },
  }},
  { name: 'Mini baozi porc', category: 'Bao', variants: {
      default:       { dlc: { days: 5 },   frozen: false },
      marseille:     { dlc: { months: 2 }, frozen: true  },
      'bao-express': { dlc: { months: 2 }, frozen: true  },
  }},

  // --- Sauces ---
  { name: 'Red oil (4kg)',                category: 'Sauces', variants: { default: { dlc: { days: 7 },   frozen: false } }},
  { name: 'Sauce shanghai noodles (4kg)', category: 'Sauces', variants: { default: { dlc: { days: 7 },   frozen: false } }},
  { name: 'Sauce S&S (4kg)',              category: 'Sauces', variants: { default: { dlc: { months: 1 }, frozen: false } }},
  { name: 'Sauce XO végétal (4kg)',       category: 'Sauces', variants: { default: { dlc: { days: 7 },   frozen: false } }},
  { name: 'Sauce haricot (2kg)',          category: 'Sauces', variants: { default: { dlc: { days: 3 },   frozen: false } }},
  { name: 'Sauce Dong Po (4kg)',          category: 'Sauces', variants: { default: { dlc: { months: 2 }, frozen: false } }},
  { name: 'Sauce charsiu (4kg)',          category: 'Sauces', variants: { default: { dlc: { months: 1 }, frozen: false } }},
  { name: 'Marinade concombre (4kg)',     category: 'Sauces', variants: { default: { dlc: { months: 1 }, frozen: false } }},
  { name: 'Marinade aubergine (4kg)',     category: 'Sauces', variants: { default: { dlc: { months: 1 }, frozen: false } }},

  // --- Farces ---
  { name: 'Farce XLB porc (500g)',    category: 'Farces', variants: { default: { dlc: { days: 3 }, frozen: false } }},
  { name: 'Gelée (1kg)',              category: 'Farces', variants: { default: { dlc: { days: 3 }, frozen: false } }},
  { name: 'Farce shrimp (0,5kg)',     category: 'Farces', variants: { default: { dlc: { days: 3 }, frozen: false } }},
  { name: 'Farce choco (500g)',       category: 'Farces', variants: { default: { dlc: { days: 3 }, frozen: false } }},
  { name: 'Chaomian homemade (1kg)',  category: 'Farces', variants: { default: { dlc: { days: 3 }, frozen: false } }},

  // --- Viandes ---
  { name: 'Échine charsiu (pièce 1kg)', category: 'Viandes', variants: { default: { dlc: { days: 3 },   frozen: false } }},
  { name: 'Poulet frit (4kg)',          category: 'Viandes', variants: { default: { dlc: { months: 2 }, frozen: false } }},
];

// ============================================================
// HELPERS
// ============================================================

function productsForRestaurant(restaurant) {
  const key = restaurant.variantKey || 'default';
  return PRODUCTS
    .map(p => {
      const v = p.variants[key] || p.variants.default;
      return { name: p.name, category: p.category, ...v };
    })
    .filter(p => p.dlc);
}

function addDlc(date, rule) {
  const d = new Date(date);
  if (rule.days)   d.setDate(d.getDate()   + rule.days);
  if (rule.months) d.setMonth(d.getMonth() + rule.months);
  return d;
}

const fr = d => d.toLocaleDateString('fr-FR');

// ============================================================
// TICKETS
// ============================================================

function FreshTicket({ restaurant, product, today, dlc }) {
  return (
    <div className="ticket ticket-fresh">
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

function FrozenTicket({ product, today, dlc }) {
  return (
    <div className="ticket ticket-frozen">
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

function TicketCopies({ restaurant, product, quantity }) {
  const today = new Date();
  const dlc = addDlc(today, product.dlc);
  const Ticket = product.frozen ? FrozenTicket : FreshTicket;
  return (
    <>
      {Array.from({ length: quantity }, (_, i) => (
        <Ticket key={i} restaurant={restaurant} product={product} today={today} dlc={dlc} />
      ))}
    </>
  );
}

// ============================================================
// APP
// ============================================================

export default function App() {
  const [restaurant, setRestaurant] = useState(null);
  const [category,   setCategory]   = useState(null);
  const [product,    setProduct]    = useState(null);
  const [quantity,   setQuantity]   = useState(1);

  // Screen 1 — restaurant
  if (!restaurant) {
    return (
      <div className="screen no-print">
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

  const products = productsForRestaurant(restaurant);
  const categories = [...new Set(products.map(p => p.category))];

  // Screen 2 — category
  if (!category) {
    return (
      <div className="screen no-print">
        <button className="back-btn" onClick={() => setRestaurant(null)}>← Retour</button>
        <div className="breadcrumb">{restaurant.name}</div>
        <h1>Choisir une catégorie</h1>
        <div className="grid">
          {categories.map(c => (
            <button key={c} className="card-btn" onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      </div>
    );
  }

  // Screen 3 — product
  if (!product) {
    const list = products.filter(p => p.category === category);
    return (
      <div className="screen no-print">
        <button className="back-btn" onClick={() => setCategory(null)}>← Retour</button>
        <div className="breadcrumb">{restaurant.name} · {category}</div>
        <h1>Choisir un produit</h1>
        <div className="grid">
          {list.map(p => (
            <button key={p.name} className="card-btn" onClick={() => { setProduct(p); setQuantity(1); }}>
              {p.name}
              {p.frozen && <span className="badge">Congelé</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Screen 4 — ticket preview + quantity + print
  return (
    <>
      <div className="screen no-print">
        <button className="back-btn" onClick={() => setProduct(null)}>← Retour</button>
        <div className="breadcrumb">{restaurant.name} · {category} · {product.name}</div>

        <h1>Aperçu de l'étiquette</h1>
        <div className="ticket-preview">
          <TicketCopies restaurant={restaurant} product={product} quantity={1} />
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

      {/* Rendered in the DOM but hidden on screen — only appears when printing */}
      <div className="print-only">
        <TicketCopies restaurant={restaurant} product={product} quantity={quantity} />
      </div>
    </>
  );
}
