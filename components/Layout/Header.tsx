import LogoutButton from "../buttons/LogoutButton";

const Header = () => {
  return (
    <div className="fixed top-0 right-0 left-0 h-10 flex justify-between p-10">
      <button>Lägg till artikel</button>
      <LogoutButton />
    </div>
  );
};

export default Header;
