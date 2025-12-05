const Card = ({ title, children, actions, subtle = false }) => (
  <div className={`card p-6 ${subtle ? 'bg-white/5' : 'bg-white/10'}`}>
    <div className="flex items-start justify-between gap-4 mb-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {actions}
    </div>
    <div className="text-white/80 leading-relaxed space-y-3">{children}</div>
  </div>
);

export default Card;

