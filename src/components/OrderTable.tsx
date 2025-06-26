import React, { useEffect, useState } from "react";
import { Order } from "../types/Order";

type Props = {
  onEdit: (order: Order) => void;
};

const OrderTable: React.FC<Props> = ({ onEdit }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:8000/orders");
    const data = await res.json();
    setOrders(data);
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć to zamówienie?")) return;

    const res = await fetch(`http://localhost:8000/orders/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Zamówienie usunięte!");
      fetchOrders(); // odśwież listę
    } else {
      alert("Błąd usuwania zamówienia.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Klient</th>
          <th>Produkt</th>
          <th>Ilość</th>
          <th>Status</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.client_name}</td>
            <td>{order.product_name}</td>
            <td>{order.quantity}</td>
            <td>{order.status}</td>
            <td>
              <button onClick={() => onEdit(order)}>Edytuj</button>
              {order.id !== undefined && (
                <button onClick={() => deleteOrder(order.id as number)}>Usuń</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
