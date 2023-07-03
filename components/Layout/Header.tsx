import LogoutButton from "../buttons/LogoutButton";

const Header = () => {
  return (
    <header className="fixed top-0 bg-white right-0 left-0 h-42 flex items-center justify-between py-6 sm:py-12 px-8 sm:px-12 lg:px-16">
      <span className="font-bold font-sans text-lg">
        Skoglund Maskin&Teknik
      </span>
      <LogoutButton />
    </header>
  );
};

export default Header;
