export default function VoteButton({ active, pending, onClick }) {
  return (
    <button
      className={`btn vote-btn ${active ? "is-voted" : ""} ${pending ? "is-pending" : ""}`}
      type="button"
      title={active ? "Click to withdraw your vote" : undefined}
      onClick={onClick}
    >
      {active ? "Your vote" : "Vote"}
    </button>
  );
}
