import type { ReactElement } from "react";
import MainLayout from "../../components/main-layout/main-layout";

const Schedule = (): ReactElement => {
    return (
        <MainLayout headerTitle="Schedule" error="" isLoading={false}>
            Schedule
        </MainLayout>
    );
};

export default Schedule;