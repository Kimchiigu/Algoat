import UserAvatar from "./user-avatar";

export default function Forum({
  username = "",
  title = "",
  content = "",
  createdAt = "",
}) {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <UserAvatar username={username} createdAt={createdAt} />
      <p className="mt-4">{content}</p>
    </div>
  );
}
