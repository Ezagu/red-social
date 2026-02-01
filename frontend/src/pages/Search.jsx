import { PageWithHeader } from "../components/pages/PageWithHeader";
import { SearchUsers } from "../components/user/SearchUsers";

export const Search = () => {
  return (
    <PageWithHeader title="Buscar usuarios">
      <div className="p-4">
        <SearchUsers inputBorder={true} />
      </div>
    </PageWithHeader>
  );
};
