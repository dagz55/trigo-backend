import os

def find_terminals():
    common_terminals = [
        'Terminal.app',
        'iTerm.app',
        'Alacritty.app',
        'Kitty.app',
        'Hyper.app',
        'WezTerm.app'
    ]
    
    search_paths = [
        '/Applications',
        '/System/Applications',
        os.path.expanduser('~/Applications')
    ]
    
    found_terminals = []
    
    for path in search_paths:
        if os.path.exists(path):
            for terminal in common_terminals:
                if os.path.exists(os.path.join(path, terminal)):
                    found_terminals.append(terminal)
    
    return found_terminals

def main():
    terminals = find_terminals()
    if terminals:
        print("Installed terminals:")
        for terminal in terminals:
            print(f"- {terminal}")
    else:
        print("No common terminal applications found.")

if __name__ == "__main__":
    main()
