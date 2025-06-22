#!/bin/bash

# Create VNC config
mkdir -p ~/.vnc

# Create xstartup file
cat > ~/.vnc/xstartup << EOF
#!/bin/sh
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
startxfce4 &
EOF

chmod +x ~/.vnc/xstartup

# Set up XFCE theme
mkdir -p ~/.config/xfce4/xfconf/xfce-perchannel-xml/
cat > ~/.config/xfce4/xfconf/xfce-perchannel-xml/xsettings.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<channel name="xsettings" version="1.0">
  <property name="Net" type="empty">
    <property name="ThemeName" type="string" value="Adwaita-dark"/>
    <property name="IconThemeName" type="string" value="Adwaita"/>
  </property>
  <property name="Gtk" type="empty">
    <property name="CursorThemeName" type="string" value="Adwaita"/>
    <property name="CursorThemeSize" type="int" value="24"/>
  </property>
</channel>
EOF

# Create a desktop shortcut for terminal
mkdir -p ~/Desktop
cat > ~/Desktop/Terminal.desktop << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Terminal
Comment=Terminal Emulator
Exec=xfce4-terminal
Icon=utilities-terminal
Path=
Terminal=false
StartupNotify=false
EOF

chmod +x ~/Desktop/Terminal.desktop

# Create a desktop shortcut for Firefox
cat > ~/Desktop/Firefox.desktop << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Firefox
Comment=Web Browser
Exec=firefox
Icon=firefox
Path=
Terminal=false
StartupNotify=false
EOF

chmod +x ~/Desktop/Firefox.desktop

# Create a welcome message
mkdir -p ~/Documents
cat > ~/Documents/welcome.txt << EOF
Welcome to HackBox!

This is a virtual Linux environment with a graphical desktop.
You can use this environment to:
- Browse the web with Firefox
- Use the terminal
- Create and edit files
- Run applications

Enjoy your session!
EOF

echo "Startup script completed"