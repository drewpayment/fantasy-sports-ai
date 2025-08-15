const Footer = () => {
  return (
    <footer className="bg-secondary shadow-md mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Fantasy Sports AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
