import { useState } from "react";
import { usePaginate } from "../hooks/usePaginate";
import { Loading } from "../components/ui/Loading";
import { ListPublications } from "../components/publications/ListPublications";
import { Page } from "../components/pages/Page";
import { TabSelector } from "../components/pages/TabSelector";

export const Home = () => {
  const [section, setSection] = useState("Todos");

  const {
    items: publications,
    paginate,
    loading,
    loadNextPage,
  } = usePaginate({
    endpoint: `${section === "Todos" ? "publication/publications" : "publication/publications/following"}`,
    limit: 20,
  });

  return (
    <Page>
      <TabSelector
        section={section}
        setSection={setSection}
        sections={["Todos", "Siguiendo"]}
      />
      {loading ? (
        <Loading className="my-10" />
      ) : (
        <ListPublications
          publications={publications}
          paginate={paginate}
          loadNextPage={loadNextPage}
        />
      )}
    </Page>
  );
};
