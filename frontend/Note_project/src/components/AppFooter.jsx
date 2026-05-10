const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-base-content/10 bg-base-100 px-4 py-4">
      <p className="text-center text-sm text-base-content/60">
        Made with <span className="text-error">❤</span> by Kalp Shah. &copy;{" "}
        {currentYear} NoteForge. All rights reserved.
      </p>
    </footer>
  );
};

export default AppFooter;
