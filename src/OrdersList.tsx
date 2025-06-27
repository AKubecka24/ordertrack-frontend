import React, { useEffect, useState } from "react";
import { Order } from "./types/Order";

interface OrdersListProps {
  refreshSignal: number;
  onEdit: (order: Order) => void;
  filterStatus: string;
}

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const OrdersList: React.FC<OrdersListProps> = ({
  refreshSignal,
  onEdit,
  filterStatus,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`);
      if (!res.ok) {
        throw new Error(`Błąd HTTP: ${res.status}`);
      }

      const data = await res.json();
      console.log("Odebrane zamówienia:", data);

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Oczekiwano tablicy zamówień, otrzymano:", data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania zamówień:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć to zamówienie?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Nie udało się usunąć zamówienia.");
      }

      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      console.error("Błąd przy usuwaniu:", err);
      alert("Wystąpił błąd przy usuwaniu.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshSignal]);

  return (
    <div>
      <h2>Lista zamówień</h2>
      <button onClick={fetchOrders} disabled={loading}>
        {loading ? "Ładowanie..." : "Odśwież zamówienia"}
      </button>
      <ul>
        {orders
          .filter((order) => !filterStatus || order.status === filterStatus)
          .map((order) => (
            <li key={order.id} style={{ marginBottom: "0.5rem" }}>
              <strong>{order.client_name}</strong> zamówił(a){" "}
              <em>{order.product_name}</em> – {order.quantity} szt. – Status:{" "}
              <b>{order.status}</b>
              <br />
              <button
                onClick={() => onEdit(order)}
                style={{ marginRight: "0.5rem" }}
              >
                Edytuj
              </button>
              <button
                onClick={() => deleteOrder(order.id!)}
                disabled={deletingId === order.id}
              >
                {deletingId === order.id ? "Usuwanie..." : "Usuń"}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default OrdersList;
