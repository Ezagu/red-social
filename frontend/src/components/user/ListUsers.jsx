import { UserCard } from "./UserCard";

export const ListUsers = ({ users = [] }) => {
  if (users.length === 0) {
    return (
      <p className="text-text-secondary my-10 text-center text-xl tracking-wide">
        No hay usuarios
      </p>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-2">
      {users.map((user) => (
        <UserCard user={user} key={user._id} />
      ))}
    </ul>
  );
};
