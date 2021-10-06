# power-protocol-simulation

Platform to simulate protocols used in electric power transmission/distribution systems.
The system focuses on learning protocols in an interactive way.

![](anim2.gif)

## Features:

The system has the following features:
  * DNP3 protocol support;
  * Configuration of multiple RTUs per master;
  * Analog and digital point settings;
  * Protocol communication traces visualization;
  * Point status  visualization;
  * Historic data  visualization;
  * Master parameter settings;
  * Digital commands control;

## Installation procedure:

  * run "npm run dev" to start the plataform

## Compilation requirement:

This project uses different relevant open-source projects present on Github, always obeying their respective use licenses:

  * opendnp3: [https://github.com/dnp3/opendnp3]
  * react-diagrams: [https://github.com/projectstorm/react-diagrams]
  * electron: [https://github.com/electron/electron]
  * react: [https://github.com/facebook/react]
  * nodejs: [https://github.com/nodejs]

Use the installation procedure below to compile the project:

  * Install nodejs, electron, react;
  * Clone the opendnp3 lib inside rtu_dnp3 and inside master_dnp3
  * Use the CMAKE to compile the RTU and master
  * Run "npm run dev" to start the plataform
