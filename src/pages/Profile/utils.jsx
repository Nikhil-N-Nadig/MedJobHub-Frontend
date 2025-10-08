//helper util functions for profile page
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

export const ReadOnlyField = ({ 
  label, 
  value, 
  icon: Icon
}) => {
  return (
    <div className="editable-field">
      
      <div className="field-header">
        <div className="field-icon-title">
          <Icon className="field-icon" />
          <h3 className="field-title">{label}</h3>
        </div>
      </div>

      <div className="field-content">
        <p className={`field-display ${!value ? 'empty' : ''}`}>
          {value || "Not provided"}
        </p>
      </div>

    </div>
  );
};

export const EditableField = ({ 
  label, 
  value, 
  fieldName, 
  icon: Icon, 
  type = "text", 
  placeholder = "", 
  options = [],
  isEditing,
  isLoading,
  profileData,
  onInputChange,
  onEditField,
  onSaveField,
  onCancelEdit
}) => {
  return (
    <div className="editable-field">
      <div className="field-header">
        <div className="field-icon-title">
          <Icon className="field-icon" />
          <h3 className="field-title">{label}</h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => onEditField(fieldName)}
            className="edit-btn"
          >
            <FaEdit />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className="field-content">
        {isEditing ? (
          <div>
            {type === "textarea" ? (
              <textarea
                name={fieldName}
                value={profileData[fieldName] || ""}
                onChange={onInputChange}
                placeholder={placeholder}
                className="field-textarea"
              />
            ) : type === "select" ? (
              <select
                name={fieldName}
                value={profileData[fieldName] || ""}
                onChange={onInputChange}
                className="field-select"
              >
                <option value="">{placeholder}</option>
                {options.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                name={fieldName}
                value={profileData[fieldName] || ""}
                onChange={onInputChange}
                placeholder={placeholder}
                className="field-input"
              />
            )}
            <div className="field-buttons">
              <button
                onClick={() => onSaveField(fieldName)}
                disabled={isLoading}
                className="save-btn"
              >
                <FaSave />
                <span>{isLoading ? "Saving..." : "Save"}</span>
              </button>
              <button
                onClick={() => onCancelEdit(fieldName)}
                className="cancel-btn"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <p className={`field-display ${!value ? 'empty' : ''}`}>
            {value || "Not provided"}
          </p>
        )}
      </div>
    </div>
  );
};
