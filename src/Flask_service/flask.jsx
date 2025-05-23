import axios from "axios";

class BackendService {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:5001", 
      withCredentials: true, 
    });
  }

  async signup(formData) {
    try {
      const response = await this.api.post("/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Signup failed";
    }
  }

  async signin({ username, password }){
    try {
      const response = await this.api.post("/signin", { username, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Login failed" };
    }
  }

  async verifyOtp({ username, otp }) {
    try {
      const response = await this.api.post("/verify_otp", { username, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || "OTP verification failed";
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.api.get("/get_user");
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  async logout() {
    try {
      const response=await this.api.post("/logout");
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      return null;
    }
  }

  async getAvailableJobs() {
    try {
      const response = await this.api.get("/available_jobs",{withCredentials:true});
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to fetch jobs";
    }
  }

  async getEmployerJobs() {
    try {
      const response = await this.api.get("/your_jobs",{withCredentials:true});
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to fetch employer jobs";
    }
  }

  async addJob(jobData) {
    try {
      const response = await this.api.post("/add_job", jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to add job";
    }
  }

  async deleteJob(jobId) {
    try {
      const response = await this.api.post(`/delete_job/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to delete job";
    }
  }

  async getEmployerApplications() {
    try {
      const response = await this.api.get("/employer_applications",{withCredentials:true});
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to fetch applications";
    }
  }

  async getJobSeekerApplications() {
    try {
      const response = await this.api.get("/jobseeker_applications",{withCredentials:true});
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to fetch job seeker applications";
    }
  }

  async applyJob(jobId, applicationData) {
    try {
      const response = await this.api.post(`/apply_job/${jobId}`, applicationData,{withCredentials:true});
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to apply for job";
    }
  }

  async deleteApplication(applicationId) {
    try {
      const response = await this.api.post(`/delete_application/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to delete application";
    }
  }

  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await this.api.post(`/update_application/${applicationId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to update application status";
    }
  }

  async getJobDetails(jobId) {
    try {
      const response = await this.api.get(`/job_details/${jobId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to fetch job details";
    }
  }

  async verifyToken(auth_token){
    try{
      const response=await this.api.post('/verify-token',{auth_token})
      return response.data;
    }
    catch(error){
      throw error.response?.data || "Failed to fetch tokens";
    }
  } 
  
  async uploadImageToCloudinary() {
    try {
      const response = await this.api.post('/upload_image_to_cloudinary');
      return response.data.url || null;
    } catch (error) {
      throw error.response?.data || "Failed to upload image";
    }
  }

  async contact_us({name,email,phone,message}){
    try{
      const response = await this.api.post('/contact_us', { 
        name, 
        email, 
        phone, 
        message 
    }, {
        headers: { "Content-Type": "application/json" } 
    });
      return response.data
    }
    catch(error){
      throw error.response?.data || "Failed to send response email";
    }
  }
}

const backendService = new BackendService();

export default backendService;
