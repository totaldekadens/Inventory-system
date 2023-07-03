import LogoutButton from "../buttons/LogoutButton";

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 h-42 flex justify-between py-12 px-8 sm:px-12 lg:px-16">
      <h2 className="font-bold font-sans text-lg">Skoglund Maskin&Teknik</h2>
      <LogoutButton />
    </header>
  );
};

export default Header;
