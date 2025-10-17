import React from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../../components/JobCard/JobCard";
import { useState,useEffect, useRef } from "react";
import backendService from "../../Flask_service/flask";
import { useSelector } from "react-redux";
import "../JobsList/JobsList.css"
import { useFlash } from "../../context/FlashContext";
import { Link } from "react-router-dom";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // filter states
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [dateFrom, setDateFrom] = useState(""); // added date filter
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [sortOption, setSortOption] = useState(""); // e.g. "experience_asc"
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  // show/hide filter panel
  const [showFilters, setShowFilters] = useState(false);

  const { setFlashMessage } =useFlash()
  const user = useSelector((state) => state.auth.userData);
  const role = user?.role;

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [role]);

  // helper - basic client-side matching (used for employer list)
  const matchesFilters = (job, filters) => {
    const { q, location, qualifications, specialization, employment_type, min_salary, max_salary, min_experience, date_from } = filters || {};

    // text search across several fields
    if (q) {
      const qv = String(q).toLowerCase();
      const hay = [
        job.title,
        job.description,
        job.company,
        job.location,
        job.specialization
      ].filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(qv)) return false;
    }

    if (location) {
      if (!String(job.location || "").toLowerCase().includes(String(location).toLowerCase())) return false;
    }

    if (qualifications) {
      if (!String(job.required_qualifications || "").toLowerCase().includes(String(qualifications).toLowerCase())) return false;
    }

    if (specialization) {
      if (!String(job.specialization || "").toLowerCase().includes(String(specialization).toLowerCase())) return false;
    }

    if (employment_type) {
      if (String(job.employment_type || "") !== String(employment_type)) return false;
    }

    if (min_salary != null) {
      const s = Number(job.salary || 0);
      if (Number.isFinite(min_salary) && s < min_salary) return false;
    }

    if (max_salary != null) {
      const s = Number(job.salary || 0);
      if (Number.isFinite(max_salary) && s > max_salary) return false;
    }

    if (min_experience != null) {
      // job.required_experience may be varchar like "3+ years" -> take first digit
      const expRaw = String(job.required_experience || "").trim();
      const leading = expRaw ? parseInt(expRaw[0], 10) : NaN;
      if (!Number.isNaN(min_experience) && (Number.isNaN(leading) || leading < min_experience)) return false;
    }

    if (date_from) {
      try {
        const jobDate = new Date(job.posted_on || job.created_at || 0);
        const from = new Date(date_from);
        if (isNaN(jobDate.getTime()) || isNaN(from.getTime()) || jobDate < from) return false;
      } catch (e) {
        /* ignore parse errors and do not filter out */
      }
    }

    return true;
  };

  // close dropdown on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // helper to perform sorting on a list
  const sortList = (list, option) => {
     if (!option || !Array.isArray(list)) return list;
     const [key, dir] = option.split("_"); // key=experience|salary|date, dir=asc|desc
     const mul = dir === "asc" ? 1 : -1;
     const copy = [...list];
     return copy.sort((a,b) => {
       try {
         if (key === "experience") {
           const av = parseInt(String(a.required_experience || "").trim()[0] || "0", 10) || 0;
           const bv = parseInt(String(b.required_experience || "").trim()[0] || "0", 10) || 0;
           return (av - bv) * mul;
         }
         if (key === "salary") {
           const av = Number(a.salary || 0);
           const bv = Number(b.salary || 0);
           return (av - bv) * mul;
         }
         if (key === "date") {
           const ad = new Date(a.posted_on || a.created_at || 0).getTime() || 0;
           const bd = new Date(b.posted_on || b.created_at || 0).getTime() || 0;
           return (ad - bd) * mul;
         }
       } catch (e) { return 0; }
       return 0;
     });
  };

  const applyClientFilters = (list, filters) => {
    if (!list || list.length === 0) return [];
    return list.filter((j) => matchesFilters(j, filters));
  };

  const fetchJobs = async (overrides = {}) => {
    setLoading(true);
    try {
      // make filters object
      const filters = {
        q: q?.trim() || undefined,
        location: location?.trim() || undefined,
        qualifications: qualifications?.trim() || undefined,
        specialization: specialization?.trim() || undefined,
        date_from: dateFrom || undefined,
        employment_type: employmentType || undefined,
        min_salary: minSalary ? Number(minSalary) : undefined,
        max_salary: maxSalary ? Number(maxSalary) : undefined,
        min_experience: minExperience ? Number(minExperience) : undefined,
        page: 1,
        page_size: 100,
        ...overrides,
      };

      let response;
      if (role === "employer") {
        // employer: fetch own jobs then apply client-side filter
        response = await backendService.getEmployerJobs();
        const list = response?.jobs || response?.items || [];
        setJobs(list);
        const filtered = applyClientFilters(list, filters);
        setFilteredJobs(sortList(filtered, sortOption));
        setTotal(filtered.length);
      } else {
        // non-employer: server-side filtering
        response = await backendService.getAvailableJobs(filters);
        const list = response?.items || response?.jobs || [];
        setJobs(list);
        setFilteredJobs(sortList(list, sortOption));
        setTotal(response?.total ?? list.length);
      }
    } catch (error) {
      setFlashMessage(`Error fetching jobs: ${error}` ,"error");
      setJobs([]);
      setFilteredJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // when user changes filters or jobs list, re-apply client-side filtering + sorting
  useEffect(() => {
    const filters = {
      q: q?.trim() || undefined,
      location: location?.trim() || undefined,
      qualifications: qualifications?.trim() || undefined,
      specialization: specialization?.trim() || undefined,
      date_from: dateFrom || undefined,
      employment_type: employmentType || undefined,
      min_salary: minSalary ? Number(minSalary) : undefined,
      max_salary: maxSalary ? Number(maxSalary) : undefined,
      min_experience: minExperience ? Number(minExperience) : undefined,
    };
    const filtered = applyClientFilters(jobs, filters);
    setFilteredJobs(sortList(filtered, sortOption));
    setTotal(filtered.length);
    // eslint-disable-next-line
  }, [q, location, qualifications, specialization, employmentType, minSalary, maxSalary, minExperience, jobs, sortOption, dateFrom]);

  const handleSearch = () => {
    fetchJobs();
  };

  const resetFilters = () => {
    setQ("");
    setLocation("");
    setQualifications("");
    setSpecialization("");
    setEmploymentType("");
    setMinSalary("");
    setMaxSalary("");
    setMinExperience("");
    setDateFrom("");
    setSortOption("");
    setSortOpen(false);
    // re-fetch (employer will reapply, non-employer get all)
    fetchJobs({});
  };

  const handleDeleteJob = (jobId) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
    setFilteredJobs(filteredJobs.filter((job) => job.id !== jobId));
  };

  return (
    <>
      <h2 className="jobs-head">{role === "employer" ? "Your Jobs" : "Available Jobs"}</h2>

      {/* Filter UI - collapsible panel */}
      <div className={`filter-panel ${showFilters ? "open" : "closed"}`} style={{ maxWidth: 1100, margin: "0 auto 16px", position: "relative" }}>
        <button
          className="filter-toggle"
          aria-expanded={showFilters}
          onClick={() => setShowFilters((s) => !s)}
          title="Toggle filters"
        >
          Filters {showFilters ? "▴" : "▾"}
        </button>

        <section className="filter-card" aria-label="Job filters">
          <div className="filter-row">
           <input className="filter-input narrow-30" placeholder="Search jobs, keywords..." value={q} onChange={(e)=>setQ(e.target.value)} />
           <input className="filter-input narrow-30" placeholder="Location" value={location} onChange={(e)=>setLocation(e.target.value)} />
           <input className="filter-input narrow-30" placeholder="Qualifications " value={qualifications} onChange={(e)=>setQualifications(e.target.value)} />
           <input className="filter-input narrow-30" placeholder="Specialization " value={specialization} onChange={(e)=>setSpecialization(e.target.value)} />
            <select className="filter-input" value={employmentType} onChange={(e)=>setEmploymentType(e.target.value)}>
              <option value="">Any type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

         <div className="filter-row">
           <div className="small-inputs">
             <label className="small-label">Date</label>
             <input className="filter-input small" type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
           </div>
           <div className="small-inputs">
             <label className="small-label">Salary</label>
             <input className="filter-input small salary-input" type="number" placeholder="Min" value={minSalary} onChange={(e)=>setMinSalary(e.target.value)} min="0" />
             <input className="filter-input small salary-input" type="number" placeholder="Max" value={maxSalary} onChange={(e)=>setMaxSalary(e.target.value)} min="0" />
           </div>

           <div className="small-inputs">
             <label className="small-label">Min Experience (yrs)</label>
             <input className="filter-input small" type="number" placeholder="e.g. 2" value={minExperience} onChange={(e)=>setMinExperience(e.target.value)} min="0" />
           </div>

           <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
             {/* For non-employer this triggers server fetch, for employer it reapplies client filters */}
             <button className="btn primary" onClick={handleSearch}>Search</button>
             <button className="btn" onClick={resetFilters}>Reset</button>

             <div className="sort-wrapper" ref={sortRef}>
               <button className="btn" onClick={() => setSortOpen(s => !s)} aria-haspopup="true" aria-expanded={sortOpen}>
                 Sort ▾
               </button>
               {sortOpen && (
                 <div className="sort-dropdown">
                   <button className="sort-item" onClick={() => { setSortOption("experience_asc"); setSortOpen(false); }}>Experience ↑</button>
                   <button className="sort-item" onClick={() => { setSortOption("experience_desc"); setSortOpen(false); }}>Experience ↓</button>
                   <hr />
                   <button className="sort-item" onClick={() => { setSortOption("salary_asc"); setSortOpen(false); }}>Salary ↑</button>
                   <button className="sort-item" onClick={() => { setSortOption("salary_desc"); setSortOpen(false); }}>Salary ↓</button>
                   <hr />
                   <button className="sort-item" onClick={() => { setSortOption("date_asc"); setSortOpen(false); }}>Date ↑</button>
                   <button className="sort-item" onClick={() => { setSortOption("date_desc"); setSortOpen(false); }}>Date ↓</button>
                   <hr />
                   <button className="sort-item" onClick={() => { setSortOption(""); setSortOpen(false); }}>Clear</button>
                 </div>
               )}
             </div>
           </div>
         </div>
        </section>
      </div>

      {/* results bar: top-left count (outside job container) */}
      <div className="results-bar" style={{ maxWidth: 1100, margin: "0 auto 12px", padding: "0 12px", boxSizing: "border-box" }}>
        <div className="results-count" style={{ color: "#1b3a57", fontSize: "0.95rem" }}>
          {total > 0 ? <><strong>{total}</strong> result{total === 1 ? "" : "s"}</> : null}
        </div>
      </div>

      <section className="job-container" style={{ maxWidth: 1200 }}>
        {filteredJobs && filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              userRole={role}
              userId={user?.id}
              onDeleteJob={handleDeleteJob}
            />
          ))
        ) : (
          <p className="no-applications">No jobs available.</p>
        )}
      </section>

      {/* Employer CTA - placed outside job grid and centered */}
      {role === "employer" && (
        <div className="employer-cta" aria-hidden={role !== "employer"}>
          <p className="add-job-info">Click here to add more job opportunities and grow your team!</p>
          <div className="jobcard-btn-field">
            <Link to="/add-job" className="add-job-btn">Add a New Job</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default JobListings;
