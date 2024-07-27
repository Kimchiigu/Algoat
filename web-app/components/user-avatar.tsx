import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserAvatar({ username = "user", createdAt = "" }) {
  const getUserInitial = () => {
    if (typeof username === "string" && username.length > 0) {
      return username.charAt(0).toUpperCase();
    }
    return "PFP";
  };
  return (
    <>
      <div className={"flex flex-row gap-4 items-center"}>
        <Avatar>
          <AvatarImage src="" alt="" />
          <AvatarFallback>{getUserInitial()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <div
            className={
              "overflow-hidden text-ellipsis whitespace-nowrap text-lg"
            }
          >
            {username}
          </div>
          <div
            className={
              "overflow-hidden text-ellipsis whitespace-nowrap text-sm"
            }
          >
            {createdAt}
          </div>
        </div>
      </div>
    </>
  );
}
