export function Checkbox({ checked, onChange }) {
  return <input type="checkbox" className="checkbox" checked={checked} onChange={onChange} />;
}
