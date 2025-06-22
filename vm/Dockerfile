FROM alpine:latest

# Install necessary packages
RUN apk add --no-cache \
    bash \
    openssh-server \
    sudo \
    curl \
    wget \
    vim \
    nano \
    grep \
    findutils \
    coreutils \
    procps \
    util-linux \
    shadow \
    openrc \
    htop \
    python3 \
    nodejs \
    npm

# Configure SSH
RUN mkdir -p /var/run/sshd && \
    echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config && \
    echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config && \
    ssh-keygen -A

# Create a user
RUN adduser -D -s /bin/bash hackbox && \
    echo "hackbox:hackbox" | chpasswd && \
    adduser hackbox wheel

# Allow hackbox user to use sudo
RUN echo "hackbox ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Set up environment
RUN mkdir -p /home/hackbox/projects && \
    chown -R hackbox:hackbox /home/hackbox

# Create a welcome message
RUN echo "Welcome to HackBox - Web-based Linux VM!" > /etc/motd && \
    echo "echo 'Welcome to your Linux VM terminal!'" >> /home/hackbox/.bashrc && \
    echo "echo 'Type \"ls\" to list files in the current directory.'" >> /home/hackbox/.bashrc && \
    echo "echo 'Type \"help\" for a list of available commands.'" >> /home/hackbox/.bashrc

# Create some example files
RUN echo "# Welcome to HackBox\n\nThis is a sample markdown file to help you get started.\n\n## Commands to try:\n\n- ls: List files\n- cd: Change directory\n- cat: View file contents\n- nano: Edit files\n- htop: Monitor system resources" > /home/hackbox/README.md && \
    chown hackbox:hackbox /home/hackbox/README.md

# Create a simple Python example
RUN echo "#!/usr/bin/env python3\n\nprint('Hello from Python!')\nprint('This is a sample script.')\n\nname = input('What is your name? ')\nprint(f'Hello, {name}! Welcome to HackBox.')" > /home/hackbox/hello.py && \
    chmod +x /home/hackbox/hello.py && \
    chown hackbox:hackbox /home/hackbox/hello.py

# Create a simple Node.js example
RUN echo "console.log('Hello from Node.js!');\nconsole.log('This is a sample script.');\n\nconst readline = require('readline').createInterface({\n  input: process.stdin,\n  output: process.stdout\n});\n\nreadline.question('What is your name? ', name => {\n  console.log(`Hello, ${name}! Welcome to HackBox.`);\n  readline.close();\n});" > /home/hackbox/hello.js && \
    chmod +x /home/hackbox/hello.js && \
    chown hackbox:hackbox /home/hackbox/hello.js

# Expose SSH port
EXPOSE 22

# Start SSH server
CMD ["/usr/sbin/sshd", "-D"]