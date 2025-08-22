import NavigationSidebar from "../../../components/custom/NavigationSidebar/NavigationSidebar";
import FormDetailView from "../../../components/dashboard/FormDetailView/FormDetailView";
import { sidebarItems } from "../../../core/Constants/sidebarItemsClient";

const FormDetailPage: React.FC = () => {
  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Dashboard" />
      <FormDetailView />
    </>
  );
};

export default FormDetailPage;
