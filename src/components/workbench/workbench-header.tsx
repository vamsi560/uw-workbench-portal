export function WorkbenchHeader() {
  const navItems = [{ name: "UW Workbench", active: true }];

  return (
    <header className="bg-secondary shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="https://www.valuemomentum.com/wp-content/uploads/2024/01/ValueMomentum_logo.svg" alt="ValueMomentum Logo" className="h-8" />
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-secondary-foreground">Underwriting Workbench</h1>
              <nav className="hidden md:flex md:space-x-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className={`flex items-center text-sm font-medium ${
                      item.active
                        ? "text-primary border-b-2 border-primary"
                        : "text-secondary-foreground/70 hover:text-secondary-foreground"
                    }`}
                  >
                    {item.icon && <item.icon className="mr-1 h-4 w-4" />}
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
