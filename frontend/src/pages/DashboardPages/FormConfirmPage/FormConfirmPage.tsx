import NavigationSidebar from "../../../components/core/NavigationSidebar/NavigationSidebar";
import FormConfirmView from "../../../components/dashboard/FormConfirmView/FormConfirmView";
import { sidebarItems } from "../../../core/Constants/sidebarItemsClient";

const FormDetailPage: React.FC = () => {
  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Dashboard" />
      <FormConfirmView />
    </>
  );
};

export default FormDetailPage;
