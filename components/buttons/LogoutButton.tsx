import { useSession, signOut } from "next-auth/react";
import { IconLogout } from "@tabler/icons-react";
const LogoutButton = (props: any) => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <div
          className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-end"
          onClick={() => signOut()}
        >
          <IconLogout {...props} />
        </div>
      ) : null}
    </>
  );
};

export default LogoutButton;
