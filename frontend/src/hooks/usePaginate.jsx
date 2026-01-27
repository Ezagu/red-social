import React, { useEffect, useState } from "react";
import Request from "../helpers/Request";

export const usePaginate = ({ endpoint, limit = 5, page = 1 }) => {
  const [items, setItems] = useState([]);
  const [paginate, setPaginate] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      const response = await Request(`${endpoint}?limit=${limit}&page=${page}`);

      if (response.status === "error") {
        return;
      }

      setItems(response.items);

      delete response.items;
      setPaginate(response);

      setLoading(false);
    };

    loadItems();
  }, [endpoint, limit, page]);

  const loadNextPage = async () => {
    const response = await Request(
      `${endpoint}?limit=${limit}&page=${Number(paginate.page) + 1}`,
    );

    if (response.status === "error") {
      return;
    }

    const { items, ...pagination } = response;

    setItems((prev) => [...prev, ...items]);

    setPaginate(pagination);
  };

  return {
    items,
    paginate,
    loading,
    loadNextPage,
  };
};
