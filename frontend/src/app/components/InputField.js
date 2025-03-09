// InputField.js
export default function InputField({ label, type, placeholder }) {
    return (
        <div className="input-group">
            <label className="input-label">{label}</label>
            <input className="input-field" type={type} placeholder={placeholder} />
        </div>
    );
}
