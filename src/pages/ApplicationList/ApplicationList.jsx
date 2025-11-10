import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import ApplicationCard from "../../components/ApplicationCard/ApplicationCard";
import backendService from "../../Flask_service/flask";
import "../ApplicationList/ApplicationList.css";
import { useFlash } from "../../context/FlashContext";

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // filter states
  const [q, setQ] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [minExperience, setMinExperience] = useState("");   // added experience filter
  const [sortOption, setSortOption] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  // show/hide filters panel
  const [showFilters, setShowFilters] = useState(false);

  const { setFlashMessage } = useFlash();
  const user = useSelector((state) => state.auth.userData);
  const role = user?.role;

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        let response;
        if (role === "employer") {
          response = await backendService.getEmployerApplications();
        } else {
          response = await backendService.getJobSeekerApplications();
        }

        const list = response?.applications || response?.items || response || [];
        setApplications(list);
        setFilteredApplications(list);
        setTotal(list.length);
      } catch (error) {
        setFlashMessage(`Error fetching applications: ${error}`, "error");
        setApplications([]);
        setFilteredApplications([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
    // eslint-disable-next-line
  }, [role]);

  const parseDate = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };

  const numericFrom = (val) => {
    if (val == null || val === "") return NaN;
    const n = Number(String(val).replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : NaN;
  };

  const matchesFilters = (app) => {
    if (q) {
      const qv = String(q).toLowerCase();
      const hay = [
        app?.job?.title,
        app?.job?.company,
        app?.cover_letter,
        app?.applicant?.name,
        app?.applicant?.username,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(qv)) return false;
    }

    if (jobTitle) {
      if (!String(app?.job?.title || "").toLowerCase().includes(String(jobTitle).toLowerCase())) return false;
    }

    if (qualifications) {
      if (!String(app?.job?.required_qualifications || "").toLowerCase().includes(String(qualifications).toLowerCase())) return false;
    }

    if (specialization) {
      if (!String(app?.job?.specialization || "").toLowerCase().includes(String(specialization).toLowerCase())) return false;
    }

    if (status) {
      if (String(app?.application_status || "").toLowerCase() !== String(status).toLowerCase()) return false;
    }

    if (minSalary) {
      const salaryVal = numericFrom(app?.job?.salary) || 0;
      if (Number.isFinite(numericFrom(minSalary)) && salaryVal < Number(minSalary)) return false;
    }
    if (maxSalary) {
      const salaryVal = numericFrom(app?.job?.salary) || 0;
      if (Number.isFinite(numericFrom(maxSalary)) && salaryVal > Number(maxSalary)) return false;
    }
    // experience filter: take first digit from job.required_experience (varchar) and compare
    if (minExperience) {
      const expRaw = String(app?.job?.required_experience || "").trim();
      const leading = expRaw ? parseInt(expRaw[0], 10) : NaN;
      const reqExp = Number.isNaN(leading) ? 0 : leading;
      if (!Number.isNaN(Number(minExperience)) && reqExp < Number(minExperience)) return false;
    }
    if (dateFrom) {
      const from = parseDate(dateFrom);
      const applied = parseDate(app?.applied_on || app?.created_at || app?.submitted_at);
      if (!applied || (from && applied < from)) return false;
    }
    if (dateTo) {
      const to = parseDate(dateTo);
      const applied = parseDate(app?.applied_on || app?.created_at || app?.submitted_at);
      if (!applied || (to && applied > new Date(to.getTime() + 24 * 60 * 60 * 1000 - 1))) return false;
    }

    return true;
  };

  const applyFilters = useCallback(() => {
    let filtered = applications.filter((a) => matchesFilters(a));

    if (sortOption) {
      const [key, dir] = sortOption.split("_");
      const mul = dir === "asc" ? 1 : -1;
      filtered = filtered.slice().sort((x, y) => {
        try {
          if (key === "experience") {
            const ax = parseInt(String(x?.job?.required_experience || "").trim()[0] || "0", 10) || 0;
            const bx = parseInt(String(y?.job?.required_experience || "").trim()[0] || "0", 10) || 0;
            return (ax - bx) * mul;
          }
          if (key === "salary") {
            const ax = numericFrom(x?.job?.salary) || 0;
            const bx = numericFrom(y?.job?.salary) || 0;
            return (ax - bx) * mul;
          }
          if (key === "date") {
            const ad = parseDate(x?.applied_on || x?.created_at) ? parseDate(x?.applied_on || x?.created_at).getTime() : 0;
            const bd = parseDate(y?.applied_on || y?.created_at) ? parseDate(y?.applied_on || y?.created_at).getTime() : 0;
            return (ad - bd) * mul;
          }
        } catch (e) {
          return 0;
        }
        return 0;
      });
    }

    setFilteredApplications(filtered);
    setTotal(filtered.length);
  }, [applications, sortOption, q, jobTitle, status, dateFrom, dateTo, minSalary, maxSalary, qualifications, specialization, minExperience]);

  const resetFilters = () => {
    setQ("");
    setJobTitle("");
    setStatus("");
    setDateFrom("");
    setMinSalary("");
    setMaxSalary("");
    setQualifications("");
    setSpecialization("");
    setMinExperience("");
    setSortOption("");
    setFilteredApplications(applications);
    setTotal(applications.length);
  };

  useEffect(() => {
    applyFilters();
  }, [applications, applyFilters]);

  const handleUpdateApplicationStatus = (applicationId, action) => {
    if (action === "delete") {
      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
      setFilteredApplications((prev) => prev.filter((app) => app.id !== applicationId));
    } else {
      setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, application_status: action } : app)));
      setFilteredApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, application_status: action } : app)));
    }
  };

  const handleWithdrawApplication = (applicationId) => {
    setApplications((prev) => prev.filter((application) => application.id !== applicationId));
    setFilteredApplications((prev) => prev.filter((application) => application.id !== applicationId));
    setTotal((t) => Math.max(0, t - 1));
  };

  useEffect(() => {
    const onDoc = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <>
      <h2 className="applications-head">Job Applications</h2>

      {/* Filter card - collapsible */}
{/* Right-side sliding filter sidebar */}
<div className={`filter-sidebar ${showFilters ? "open" : ""}`}>
  <button
    className="filter-close"
    onClick={() => setShowFilters(false)}
    aria-label="Close filters"
  >
    ✕
  </button>

  <div className="filter-header">
    <span>⚙️ Filters</span>
  </div>

  <div className="filter-content">
    <input
      className="filter-input"
      placeholder="Search (job, company, applicant)..."
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
    <input
      className="filter-input"
      placeholder="Job title"
      value={jobTitle}
      onChange={(e) => setJobTitle(e.target.value)}
    />
    <input
      className="filter-input"
      placeholder="Qualifications"
      value={qualifications}
      onChange={(e) => setQualifications(e.target.value)}
    />
    <input
      className="filter-input"
      placeholder="Specialization"
      value={specialization}
      onChange={(e) => setSpecialization(e.target.value)}
    />

    <select
      className="filter-input"
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    >
      <option value="">Any status</option>
      <option value="pending">Pending</option>
      <option value="shortlisted">Shortlisted</option>
      <option value="rejected">Rejected</option>
      <option value="hired">Hired</option>
    </select>

    <label className="small-label">Date</label>
    <input
      className="filter-input small"
      type="date"
      value={dateFrom}
      onChange={(e) => setDateFrom(e.target.value)}
    />

    <label className="small-label">Salary Range</label>
    <div style={{ display: "flex", gap: "8px" }}>
      <input
        className="filter-input small"
        type="number"
        placeholder="Min"
        value={minSalary}
        onChange={(e) => setMinSalary(e.target.value)}
        min="0"
      />
      <input
        className="filter-input small"
        type="number"
        placeholder="Max"
        value={maxSalary}
        onChange={(e) => setMaxSalary(e.target.value)}
        min="0"
      />
    </div>

    <label className="small-label">Experience (yrs)</label>
    <input
      className="filter-input small"
      type="number"
      placeholder="Min"
      value={minExperience}
      onChange={(e) => setMinExperience(e.target.value)}
      min="0"
    />

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
      }}
    >
      <button
        className="btn primary"
        onClick={() => {
          applyFilters();
        }}
      >
        Apply
      </button>
      <button
        className="btn"
        onClick={() => {
          resetFilters();
        }}
      >
        Reset
      </button>
    </div>

    {/* Sort dropdown stays inside */}
    <div className="sort-wrapper" ref={sortRef} style={{ marginTop: "20px" }}>
      <button
        className="btn"
        onClick={(e) => {
          e.preventDefault();
          setSortOpen((s) => !s);
        }}
      >
        Sort ▾
      </button>
      {sortOpen && (
        <div className="sort-dropdown">
          <button
            className="sort-item"
            onClick={() => {
              setSortOption("experience_asc");
              setSortOpen(false);
              applyFilters();
            }}
          >
            Experience ↑
          </button>
          <button
            className="sort-item"
            onClick={() => {
              setSortOption("experience_desc");
              setSortOpen(false);
              applyFilters();
            }}
          >
            Experience ↓
          </button>
          <hr />
          <button
            className="sort-item"
            onClick={() => {
              setSortOption("salary_asc");
              setSortOpen(false);
              applyFilters();
            }}
          >
            Salary ↑
          </button>
          <button
            className="sort-item"
            onClick={() => {
              setSortOption("salary_desc");
              setSortOpen(false);
              applyFilters();
            }}
          >
            Salary ↓
          </button>
          <hr />
          <button
            className="sort-item"
            onClick={() => {
              setSortOption("date_asc");
              setSortOpen(false);
              applyFilters();
            }}
          >
            Date ↑
          </button>
          <button
            className="sort-item"
            onClick={() => {
              setSortOption("date_desc");
              setSortOpen(false);
              applyFilters();
            }}
          >
            Date ↓
          </button>
          <hr />
          <button
            className="sort-item"
            onClick={() => {
              setSortOption("");
              setSortOpen(false);
              applyFilters();
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  </div>
</div>

{/* Floating Filters Button */}
<button
  className="filter-toggle-btn"
  onClick={() => setShowFilters(true)}
>
  ⚙️ Filters
</button>
      {/* results bar: top-left count (outside job container) */}
      <div
        className="results-bar"
        style={{
          display: "inline-block",
          padding: "8px 16px",
          background: "linear-gradient(135deg, #007bff 0%, #00aaff 100%)",
          borderRadius: "8px",
          color: "white",
          fontSize: "1.2rem",
          fontWeight: "500",
          boxShadow: "0 2px 6px rgba(0, 123, 255, 0.3)",
          margin: "8px 0 12px 120px",
        }}
      >
        <div className="results-count">
          {total > 0 ? (
            <>
              <strong style={{ fontWeight: "600" }}>{total}</strong>{" "}
              Result{total === 1 ? "" : "s"}
            </>
          ) : (
            "No results"
          )}
        </div>
      </div>

      <section className="applications-container">
        {loading ? <p>Loading...</p> : null}
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => {
            const applicant = application?.applicant || {};
            const applicantFullName =
              applicant.name ||
              `${(applicant.first_name || "").trim()} ${(applicant.last_name || "").trim()}`.trim() ||
              null;
            const applicantDisplay = applicantFullName || applicant.username || "Applicant";

            const headerTitle = role === "employer" ? application?.applicant_name || applicantDisplay : application?.job?.company || application?.job?.title || "Company";

            return (
              <ApplicationCard
                key={application.id}
                application={application}
                headerTitle={headerTitle}
                userRole={role}
                userId={user?.id}
                onUpdateStatus={handleUpdateApplicationStatus}
                onWithdraw={handleWithdrawApplication}
              />
            );
          })
        ) : (
          <p className="no-applications">No job applications yet.</p>
        )}
      </section>
    </>
  );
};

export default JobApplications;
