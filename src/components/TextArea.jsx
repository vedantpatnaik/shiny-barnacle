const TextArea = ({ label, value, onChange, placeholder, rows = 5, disabled = false }) => (
  <div className="w-full">
    {label && <p className="text-sm text-white/70 mb-2">{label}</p>}
    <textarea
      className="input-base min-h-[160px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
    />
  </div>
);

export default TextArea;

