const OPS = [
  { id: 'add', label: '+ Add', desc: 'Insert a letter' },
  { id: 'remove', label: '− Remove', desc: 'Delete a letter' },
  { id: 'replace', label: '↔ Replace', desc: 'Swap a letter' },
];

export default function OperationButtons({ selectedOp, onSelect, onCancel }) {
  return (
    <div className="op-buttons">
      {OPS.map(op => (
        <button
          key={op.id}
          className={`op-btn ${selectedOp === op.id ? 'op-btn--active' : ''}`}
          onClick={() => selectedOp === op.id ? onCancel() : onSelect(op.id)}
        >
          <span className="op-btn__icon">{op.label}</span>
          <span className="op-btn__desc">{op.desc}</span>
        </button>
      ))}
    </div>
  );
}
