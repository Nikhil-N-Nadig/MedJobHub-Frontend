import React from "react";
import { Link } from "react-router-dom";
import "../Jobs/Jobs.css";

const Jobs = () => {
  const jobLinks = [
    { path: "/jobs/super_specialization", label: "Super Specialization" },
    { path: "/jobs/md_doctors", label: "MD Doctors" },
    { path: "/jobs/mbbs_doctors", label: "MBBS Doctors" },
    { path: "/jobs/bams_doctors", label: "BAMS Doctors" },
    { path: "/jobs/dentists", label: "Dentists" },
    { path: "/jobs/nurse_jobs", label: "Nurse Jobs" },
    { path: "/jobs/pharmacists", label: "Pharmacists" },
    { path: "/jobs/lab_technicians", label: "Lab Technicians" },
    { path: "/jobs/medical_representatives", label: "Medical Representatives" },
    { path: "/jobs/paramedical", label: "Paramedical Jobs" },
    { path: "/jobs/front_office_desk", label: "Front Office Desk" },
    { path: "/jobs/insurance_consultants", label: "Insurance Consultants" },
    { path: "/jobs/administrators", label: "Administrators" },
    { path: "/jobs/radiologists", label: "Radiologists" },
    { path: "/jobs/ambulance_services", label: "Ambulance Services" },
    { path: "/jobs/physiotherapy", label: "Physiotherapy" },
  ];
   

  return (
    <main>
      <section className="jobs-hero">
        <h1 className="typing-effect">
          "Empower Your Passion, Shape Lives!"
          <br />"Join Us for a Healthier Tomorrow!"
        </h1>
      </section>

      <p className="job-info">Explore job opportunities—click to view more details!</p>

      <section className="grid-container">
        {jobLinks.map((job, index) => (
          <div className="grid-item" key={index}>
            <Link key={job.path} to={job.path}>{job.label}</Link>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Jobs;
