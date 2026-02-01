import { ListNotifications } from "../components/notification/ListNotifications";
import { PageWithHeader } from "../components/pages/PageWithHeader";

export const Notification = () => {
  return (
    <PageWithHeader title="Notificaciones">
      <ListNotifications />
    </PageWithHeader>
  );
};
