import roleRoutes from "./entities/roleRoutes.js";
import specialityRoutes from "./entities/specialityRoutes.js";
import availabilityRoutes from "./entities/availabilityRoutes.js";
import appointmentRoutes from "./entities/appointmentRoutes.js";
import consultationRoutes from "./entities/consultationRoutes.js";
import prescriptionRoutes from "./entities/prescriptionRoutes.js";
import pharmacyRoutes from "./entities/pharmacyRoutes.js";
import laboratoryRoutes from "./entities/laboratoryRoutes.js";
import authRoutes from "./auth/authRoutes.js";
import notificationRoutes from "./entities/notificationRoutes.js";
import userRoutes from "./entities/userRoutes.js";
import testRoutes from "./entities/testRoutes.js";

const routes = [
    {path: "/api/clinic", route: roleRoutes},
    {path: "/api/clinic", route: specialityRoutes},
    {path: "/api/clinic", route: availabilityRoutes},
    {path: "/api/clinic", route: appointmentRoutes},
    {path: "/api/clinic", route: consultationRoutes},
    {path: "/api/clinic", route: prescriptionRoutes},
    {path: "/api/clinic", route: pharmacyRoutes},
    {path: "/api/clinic", route: laboratoryRoutes},
    {path: "/api/clinic", route: testRoutes},
    {path: "/api/auth", route: authRoutes},
    {path: "/api", route: notificationRoutes},
    {path: "/api", route: userRoutes},
];

export default routes;
