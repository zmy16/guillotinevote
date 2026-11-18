export function GuillotineMark({ className }) {
  return (
    <img
      className={className}
      src={`${import.meta.env.BASE_URL}logo-mark.svg`}
      alt=""
      aria-hidden="true"
      decoding="sync"
    />
  );
}

export function BrandChip() {
  return (
    <div className="brand">
      <GuillotineMark className="brand-mark" />
      GuillotineVote
    </div>
  );
}