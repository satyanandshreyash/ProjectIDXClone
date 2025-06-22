FROM ubuntu:20.04

# setup user: sandbox
RUN useradd -ms /bin/bash sandbox

# setup working directory
WORKDIR /home/sandbox

# update ubuntu machine
RUN apt update && apt upgrade -y

# install nano and curl
RUN apt install nano curl -y

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs

# configure terminal to display current working directory
RUN echo "PS1='\w'" >> /home/sandbox/.bashrc

# setup final working directory
WORKDIR /home/sandbox/app