import { Page } from "./Page";
import { PageHeader } from "./PageHeader";

export const PageWithHeader = ({ title, children }) => {
  return (
    <Page>
      <PageHeader title={title} />
      {children}
    </Page>
  );
};
