# InsurCare Frontend

The dynamic user interface for the Insurance Management Platform, built to provide seamless navigation, interactive data displays, and distinct dashboards for customers, agents, and administrators.

## 🚀 Live Demo
* **Deployed Application:** https://vercel.com/riya-s-projects-9ee7/insurcare-frontend/8myiwA95qyhmmAzFVLcjmX3td5yS


## 🛠️ Tech Stack & Libraries
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **Charts & Analytics:** Chart.js
* **Deployment:** Vercel


## 🌟 Key Features
* **Role-Based Views:** Tailored interfaces and protected routing for Administrators, Insurance Agents, and Customers.
* **Claims Settlement Desk:** Interface for users to submit claims and track their verification progress.
* **Executive Analytics Dashboard:** Visual graphs and metrics tracking policy performance, claim stats, and premium collections using Chart.js.
* **Customer & Policy Management UI:** Comprehensive forms and tables to manage lifecycle data.


## 📂 Project Structure
```text
frontend/
├── src/
│   ├── components/  # Reusable UI components & navigation
│   ├── pages/       # View pages (Dashboards, Claims, Policies, etc.)
│   ├── layouts/     # Page layout wrappers
│   ├── services/    # API communication handlers (Axios)
│   ├── context/     # Global state management
│   ├── App.jsx      # Main application router
│   └── main.jsx     # Entry point
└── package.json
