package vn.medicare.api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    // Liệt kê đích danh tất cả các route của React Router
    @GetMapping({
        "/login", "/register", "/403",
        "/admin/dashboard", "/admin/staff", "/admin/clinics",
        "/admin/schedules", "/admin/records",
        "/doctor/dashboard", "/doctor/schedule",
        "/doctor/patients", "/doctor/profile",
        "/receptionist/dashboard", "/receptionist/appointments",
        "/receptionist/book-for-patient", "/receptionist/triage",
        "/patient/dashboard", "/patient/booking",
        "/patient/records", "/patient/profile"
    })
    public String forwardToReact() {
        // Trả quyền xử lý URL lại cho React
        return "forward:/index.html";
    }
}