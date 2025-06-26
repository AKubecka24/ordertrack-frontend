import React, { useState } from 'react';

interface OrderFormProps {
  onOrderAdded: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderAdded }) => {
  const [clientName, setClientName] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder = {
      client_name: clientName,
      product_name: productName,
      quantity,
      status,
    };

    try {
      const response = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas dodawania zamówienia.');
      }

      setClientName('');
      setProductName('');
      setQuantity(1);
      setStatus('');
      onOrderAdded(); // Odśwież listę po dodaniu
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Dodaj nowe zamówienie</h2>
      <input
        type="text"
        placeholder="Nazwa klienta"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Produkt"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Ilość"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
        required
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      />
      <button type="submit">Dodaj zamówienie</button>
    </form>
  );
};

export default OrderForm;
