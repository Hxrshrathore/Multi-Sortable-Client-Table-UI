# 🧩 Multi-Sortable Client Table UI

An interactive and customizable client table built with **Next.js App Router**, **Tailwind CSS**, **TypeScript**, and **shadcn/ui**. Features include **multi-level sorting**, **drag-and-drop sort order**, and **localStorage persistence**—ideal for dashboards and CRMs.

---

## ✨ Features

- ✅ Sort clients by multiple fields (name, email, date, status, etc.)
- 🔃 Reorder sorting priority via drag-and-drop (`@dnd-kit`)
- 🔁 Toggle between ascending/descending
- 💾 Persist sort settings with `localStorage`
- 💅 Responsive UI using `shadcn/ui` and Tailwind CSS
- 🧪 Mock data generation using `@faker-js/faker`

---

## 📁 File Structure

```

app/
page.tsx                // Main page managing data and sort logic

components/
client-table.tsx        // Displays client table using shadcn/ui
sort-panel.tsx          // UI for managing sort fields with DnD

lib/
data.ts                 // Client type + mock data
sort-utils.ts           // Core multi-sort logic

````

---

## 🚀 Quick Start

### 1. Create a New Next.js Project

```bash
npx create-next-app@latest my-client-dashboard \
  --typescript --tailwind --eslint --app --src-dir --use-pnpm
````

> Use `--use-npm` or `--use-yarn` if you prefer other package managers.

---

### 2. Set Up `shadcn/ui`

Initialize UI components:

```bash
npx shadcn@latest init
```

Install required components:

```bash
npx shadcn@latest add button card table select
```

---

### 3. Install Dependencies

```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities \
  @faker-js/faker date-fns lucide-react
```

---

### 4. Copy the Code

Place the provided code into the respective files:

* `app/page.tsx`
* `components/client-table.tsx`
* `components/sort-panel.tsx`
* `lib/data.ts`
* `lib/sort-utils.ts`

---

### 5. Run the Development Server

```bash
pnpm dev
```

> Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 Component Highlights

### 🔹 `lib/data.ts`

* Defines `Client` type
* Uses `@faker-js/faker` for mock data generation
* Exposes `clientFields` for sortable options

### 🔹 `lib/sort-utils.ts`

* Defines `SortCriterion` interface
* `applyMultiSort()` applies sorting rules in order
* Handles string, date, and status sorting

### 🔹 `components/sort-panel.tsx`

* Add, remove, reorder sorting criteria
* Built with `@dnd-kit` + `shadcn/ui`
* Includes drag handle, toggle button, and animations
* Drag events update order using a custom `arrayMove`

### 🔹 `components/client-table.tsx`

* Simple UI table of clients
* Uses `shadcn/ui`'s `<Table />`, formats dates and statuses

### 🔹 `app/page.tsx`

* Manages state of `clients` and `sortCriteria`
* Memoizes sorted results
* Syncs sort settings to/from `localStorage`

---

## 🧪 Example Use Cases

* CRM dashboards
* Admin panels with user data
* Any sortable, user-driven table UI

---

## 📸 Demo Screenshot

*Add a screenshot here of the UI with sort panel and client table side-by-side.*

---

## 🛠️ Tech Stack

* [Next.js (App Router)](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.com/)
* [@dnd-kit](https://dndkit.com/)
* [faker-js](https://github.com/faker-js/faker)
* [date-fns](https://date-fns.org/)
* [lucide-react](https://lucide.dev/)

---

## 📦 Future Enhancements

* ✅ Remote persistence (e.g., Firebase or Supabase)
* 🔍 Search + filter integration
* 📱 Mobile-first view optimization
* 🧾 Pagination or infinite scroll

---

## 📄 License

MIT — Feel free to use, fork, and build upon it.

---

## 🤝 Contributing

Pull requests and suggestions are welcome! If you find a bug or want a feature, feel free to open an issue.

---

## 👨‍💻 Author

Built with ❤️ by [@hxrshrathore](https://github.com/hxrshrathore)

```

Let me know if you want a badge version (for GitHub stars/forks etc.) or an NPM-style banner for the top.
```
