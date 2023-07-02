import LogoutButton from "../buttons/LogoutButton";

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 h-42 flex justify-between p-10">
      LOGO
      <LogoutButton />
    </header>
  );
};

export default Header;
