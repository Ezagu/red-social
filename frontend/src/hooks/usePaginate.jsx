import React, { useEffect, useState } from "react";
import Request from "../helpers/Request";

export const usePaginate = ({
  endpoint,
  limit = 5,
  page = 1,
  autoLoad = true,
}) => {
  const [items, setItems] = useState([]);
  const [paginate, setPaginate] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      const response = await Request(`${endpoint}?limit=${limit}&page=${page}`);
      if (response.status === "error") return;

      setItems(response.items);

      delete response.items;
      setPaginate(response);

      setLoading(false);
    };

    autoLoad && loadItems();
  }, [endpoint, limit, page, autoLoad]);

  const loadNextPage = async () => {
    const response = await Request(
      `${endpoint}?limit=${limit}&page=${Number(paginate.page) + 1}`,
    );
    if (response.status === "error") return;

    const { items, ...pagination } = response;

    setItems((prev) => [...prev, ...items]);

    setPaginate(pagination);
  };

  const load = async () => {
    const response = await Request(`${endpoint}?limit=${limit}&page=${page}`);
    if (response.status === "error") return;

    setItems(response.items);

    delete response.items;
    setPaginate(response);

    setLoading(false);
  };

  const addItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const removeItem = (itemId) => {
    setItems((prev) =>
      prev.filter((item) => item._id.toString() !== itemId.toString()),
    );
  };

  return {
    items,
    paginate,
    loading,
    loadNextPage,
    load,
    addItem,
    removeItem,
  };
};
