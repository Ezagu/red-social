import { useEffect, useState } from "react";
import { Loading } from "../ui/Loading.jsx";
import { Search } from "../ui/Search.jsx";
import { ListUsers } from "../user/ListUsers.jsx";
import { usePaginate } from "../../hooks/usePaginate.jsx";

export const SearchUsers = ({ inputBorder = false }) => {
  const [search, setSearch] = useState("");
  const [debouncing, setDebouncing] = useState(false);

  const {
    items: users,
    paginate,
    loadNextPage,
    load,
    loading,
    clear,
  } = usePaginate({
    endpoint: `user/users`,
    autoLoad: false,
    search,
  });

  useEffect(() => {
    clear();
    setDebouncing(true);
    const timeout = setTimeout(() => {
      if (search === "") return;
      setDebouncing(false);
      load();
    }, 400);

    //Cuando retornas, se ejecuta la proxima vez que se ejecuta el useEffect (función cleanup)
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <>
      <Search setSearch={setSearch} border={inputBorder} />
      <ul className={`mt-4 flex flex-col items-center gap-4`}>
        {search === "" ? (
          ""
        ) : loading || debouncing ? (
          <Loading />
        ) : (
          <>
            <ListUsers users={users} />
            {paginate.hasNextPage && (
              <button
                className="bg-primary hover:bg-primary-hover text-text-primary m-auto my-4 w-1/2 cursor-pointer rounded-2xl py-2 font-semibold"
                onClick={loadNextPage}
              >
                Ver más
              </button>
            )}
          </>
        )}
      </ul>
    </>
  );
};
