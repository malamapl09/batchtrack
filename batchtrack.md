This is a high-stakes, high-reward project. To succeed with **Vertical SaaS**, you need to focus on "The Golden Metric": helping the business owner understand their **Cost of Goods Sold (COGS)**.

Here is a comprehensive development and business plan for **BatchTrack** (working title).

---

# 📦 Project Plan: BatchTrack Inventory SaaS

## 1. The Core Problem

Most small production businesses (Bakeries, Micro-breweries) use spreadsheets. Spreadsheets fail because:

* They don't track **unit conversions** (Buying in 50kg sacks, using in 5g increments).
* They don't account for **waste/shrinkage**.
* They don't provide a real-time **batch cost**.

## 2. MVP Feature Set (The "Must-Haves")

To get your first paying customer, you only need these four modules:

### A. Raw Material Management

* **Unit Conversion Engine:** Define a "Purchase Unit" (e.g., Bag) and a "Usage Unit" (e.g., Gram).
* **Low-Stock Alerts:** Automated emails when an ingredient hits a custom threshold.
* **Supplier Directory:** Link ingredients to specific vendors for easy re-ordering.

### B. Recipe / Bill of Materials (BOM)

* **Digital Recipe Book:** Link raw materials to a finished product.
* **Dynamic Costing:** If the price of flour goes up 10%, the app immediately shows the new cost of a loaf of bread.

### C. Batch Production (The "Burn" Feature)

* When a user "Starts a Batch," the app automatically subtracts the required ingredients from the inventory.
* Log "Waste" (e.g., "Dropped 2kg of flour") to keep inventory accurate.

### D. Simple Dashboard

* Current stock value (Total $ sitting on shelves).
* Top 5 most expensive ingredients.

---

## 3. Technical Architecture

Since data integrity is king here, we use a "Schema-First" approach.

* **Frontend:** Next.js (for SEO and fast performance) + Tailwind CSS + Shadcn UI (for a professional "pro-tool" look).
* **Backend:** Next.js Server Actions or Node.js.
* **Database:** **PostgreSQL** (via Supabase or Neon). *Do not use NoSQL for inventory; you need relational links.*
* **Authentication:** Clerk or Supabase Auth.
* **Payments:** Stripe Billing (for monthly subscriptions).

### Database Schema Concept

```sql
-- Core Table Examples
Table ingredients {
  id uuid,
  name string,
  stock_quantity decimal,
  unit_type string (e.g., 'grams'),
  cost_per_unit decimal
}

Table recipes {
  id uuid,
  name string,
  total_batch_cost decimal
}

Table recipe_ingredients {
  recipe_id uuid,
  ingredient_id uuid,
  amount_needed decimal
}

```

---

## 4. Development Roadmap

### Phase 1: The Logic Engine (Weeks 1-3)

* Build the CRUD for Ingredients.
* **Crucial:** Build the math utility that handles conversions (, ).
* Create the Recipe builder where users add ingredients to a "list."

### Phase 2: The Production Loop (Weeks 4-5)

* Create the "Start Batch" button.
* Implement the logic that loops through a recipe and decrements the `ingredients.stock_quantity`.
* Build the Low-Stock notification system.

### Phase 3: The Polish (Weeks 6-8)

* Add Stripe integration for a 14-day free trial.
* Build a "CSV Import" tool (essential for moving people off Excel).
* Mobile-responsive UI (owners want to check stock on their phones in the warehouse).

---

## 5. Monetization & Pricing

* **The "Starter" Plan ($39/mo):** Up to 50 ingredients, 10 recipes, 1 user.
* **The "Pro" Plan ($89/mo):** Unlimited ingredients/recipes, multi-user, and "Waste Analytics."
* **Why this works:** For a bakery, $40/month is less than the cost of one wasted batch of dough.