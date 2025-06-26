import React, { useState } from "react";
import OrdersList from "./OrdersList";
import "./App.css";
import { Order } from "./types/Order";

const API_URL = "https://ordertrack-backend.onrender.com";

function App() {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!currentOrder) return;
    setCurrentOrder({ ...currentOrder, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder) return;

    setLoading(true);
    setErrorMsg("");

    const method = currentOrder.id ? "PUT" : "POST";
    const url = currentOrder.id
      ? `${API_URL}/orders/${currentOrder.id}`
      : `${API_URL}/orders`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentOrder,
          quantity: Number(currentOrder.quantity),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Błąd podczas zapisywania zamówienia");
      }

      setCurrentOrder(null);
      setRefreshSignal((prev) => prev + 1);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order: Order) => {
    setCurrentOrder(order);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>OrderTrack – Zarządzanie zamówieniami</h1>

        <button
          type="button"
          onClick={() =>
            setCurrentOrder({
              client_name: "",
              product_name: "",
              quantity: 1,
              status: "Nowe",
            })
          }
          style={{ marginBottom: "1rem" }}
        >
          + Dodaj nowe zamówienie
        </button>

        {currentOrder && (
          <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
            <h2>{currentOrder?.id ? "Edytuj zamówienie" : "Dodaj zamówienie"}</h2>

            <input
              type="text"
              name="client_name"
              placeholder="Nazwa klienta"
              value={currentOrder.client_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="product_name"
              placeholder="Nazwa produktu"
              value={currentOrder.product_name}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Ilość"
              value={currentOrder.quantity}
              onChange={handleChange}
              required
              min={1}
            />
            <select
              name="status"
              value={currentOrder.status}
              onChange={handleChange}
            >
              <option value="Nowe">Nowe</option>
              <option value="W realizacji">W realizacji</option>
              <option value="Zrealizowane">Zrealizowane</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading
                ? "Zapisywanie..."
                : currentOrder.id
                ? "Zapisz zmiany"
                : "Dodaj zamówienie"}
            </button>

            <button
              type="button"
              onClick={() => setCurrentOrder(null)}
              style={{ marginLeft: "1rem" }}
            >
              Anuluj
            </button>

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          </form>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label>Filtruj po statusie: </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Wszystkie</option>
            <option value="Nowe">Nowe</option>
            <option value="W realizacji">W realizacji</option>
            <option value="Zrealizowane">Zrealizowane</option>
          </select>
        </div>

        <OrdersList
          refreshSignal={refreshSignal}
          onEdit={handleEdit}
          filterStatus={filterStatus}
        />
      </header>
    </div>
  );
}

export default App;
