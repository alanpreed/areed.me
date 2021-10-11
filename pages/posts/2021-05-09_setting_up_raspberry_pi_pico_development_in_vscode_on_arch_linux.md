---
title: "Setting up Raspberry Pi Pico development with picoprobe in VSCode on Arch Linux"
author: Alan Reed
date: 2021-05-09
description: "An overview of the setup process for Raspberry Pi Pico development, using picoprobe in VSCode on Arch Linux."
tags: [raspberry pi pico, vscode, linux, software, embedded]
layout: layouts/post.njk
---

### Introduction 

The [Getting Started documentation](https://www.raspberrypi.org/documentation/rp2040/getting-started/) for the new Raspberry Pi Pico board is generally very good, however it covers a lot of possible arrangements and most of the setup instructions for Linux are specific to Linux running on the Raspberry Pi. Those that aren't tend to cover Ubuntu/Debian based distributions, so I've written this post as a brief overview of the setup process that's more specific to Arch Linux. 

Although the Raspberry Pi Pico can be programmed via USB, by plugging it into a computer with the BOOTSEL button pressed and then copying a UF2 file onto the mass storage device that appears, this method is not ideal for software development. Repeated programming requires disconnecting and reconnecting the board, and there is no facility for debugging the program once it is flashed onto the Pico. A better solution for development is to program the Pico via the 3-pin SWD interface on the PCB, which is the goal of this post. 

Extensive use of the official ["Getting started with Raspberry Pi Pico" guide](https://datasheets.raspberrypi.org/pico/getting-started-with-pico.pdf) will be made throughout, so it's worth keeping a copy of this to hand. 

### Hardware setup

As explained in [Chapter 5 of the official guide](https://datasheets.raspberrypi.org/pico/getting-started-with-pico.pdf#swd-program), if you are working from a regular Raspberry Pi then the Pico's SWD interface can be connected directly to this.  I personally prefer to use my desktop PC for software development, which unsurprisingly does not have a set of conveniently accessible GPIO pins that can be used for SWD.  Fortunately, the Raspberry Pi Foundation has developed a solution for this in the form of a tool called `picoprobe`. When a Pico has been flashed with the `picoprobe` firmware, it can be connected to a PC via USB and used to program and debug another Pico via SWD. For this guide we will therefore need two Picos with all header pins soldered on, and sufficient jumper wires to connect them up so that the second can be programmed via SWD. 

Below is the diagram from [Appendix A of the official guide](https://datasheets.raspberrypi.org/pico/getting-started-with-pico.pdf#picoprobe_section), which covers the use of `picoprobe` in more detail, illustrating how two Picos may be connected together when using `picoprobe`.  Note that the orange and yellow connections are optional; `picoprobe` also provides UART passthrough to the PC to allow communication with the Pico being programmed if this is desired.

{% figure "Official diagram of picoprobe connections, including power and UART passthrough. (source: Raspberry Pi Foundation)" %}
{% image  "picoprobe_diagram.png" "Example of a half-loaded image." %}
{% endfigure %}

A prebuilt UF2 file for `picoprobe` is available for download from the official site [here](https://datasheets.raspberrypi.org/soft/picoprobe.uf2), and can be flashed onto a Pico via USB as described previously. Once the board has been programmed, the green LED should light up when it is connected to the PC. 


### Installing prerequisites 
To develop projects for the Pi Pico, we will need to set up the toolchain, debugger and IDE.  The necessary packages on Arch Linux for the toolchain should be `arm-none-eabi-gcc`, `arm-none-eabi-newlib` and `cmake`, as well as the Pico SDK. The latter can be downloaded manually as described in [Chapter 2](https://datasheets.raspberrypi.org/pico/getting-started-with-pico.pdf#_the_sdk), however I chose to install the AUR package `raspberry-pico-sdk-git` instead.  This also configures the PICO_SDK_PATH environment variable for us, which will be used by VSCode.

For debug and programming, the `arm-none-eabi-gdb` package  will also be required. `picoprobe` connects to the PC using `openocd`, which needs to have been compiled with the `picoprobe` driver enabled. Again this could be done manually as described in [Appendix A](https://datasheets.raspberrypi.org/pico/getting-started-with-pico.pdf#_linux), but I instead chose to install the AUR package `openocd-picoprobe` which provides this for us. 

Finally, `visual-studio-code-bin` will need to be installed from the AUR. The open-source build in the official repositories lacks access to the marketplace, and we need to install the following three extensions from there: [cortex-debug](https://marketplace.visualstudio.com/items?itemName=marus25.cortex-debug), [c/c++ tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) and [cmake tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools).


### Grant non-root access to `openocd`
By default, `openocd` will fail to connect to the `picoprobe`-flashed Pico unless it is run as root.  This can be fixed by creating a `udev` rules file for `openocd` in `/etc/udev/rules.d`.  When I installed `openocd-picoprobe` it did provide a rules file, `/usr/lib/udev/rules.d/60-openocd.rules`, that could be copied into the correct directory. However, I found that there were a couple of issues with this - the most significant one being that, at the time of writing, it contained no entry for picoprobe. The other entries in this file also made use of the `plugdev` group, which is apparently [obsolete](https://bugs.archlinux.org/task/47205). After some testing I found that the following rule file entry was sufficient to grant non-root USB access for `openocd` on my machine, without having to create or modify any user groups:

{% figure "<code>udev</code> rules entry for <code>picoprobe</code> USB access."%}
{% highlight bash %}
# /etc/udev/rules.d/60-openocd.rules 
# Raspberry Pi Picoprobe
ATTRS{idVendor}=="2e8a", ATTRS{idProduct}=="0004", TAG+="uaccess"
{% endhighlight %}
{% endfigure %}

To test that this configuration has worked, `openocd` can be instructed to attempt to connect to a `picoprobe`-flashed Pico by using the command below.  Remember that the `picoprobe`-flashed Pico needs to be connected to the PC before running this...

{% figure "Command for connecting <code>openocd</code> to <code>picoprobe</code>."%}
{% highlight bash %}
$ openocd -f interface/picoprobe.cfg -f target/rp2040.cfg -s tcl
{% endhighlight %}
{% endfigure %}

If everything works, you should receive output similar to that shown below. Permissions changes should be updated automatically, although you will likely have to disconnect and reconnect the `picoprobe` Pico. In the event that they do not, either restart the PC or force a reload of the `udev` configuration via the command `#udevadm control --reload`.

{% figure "Terminal output when `openocd` runs successfully."%}
{% highlight text %}
Open On-Chip Debugger 0.10.0+dev-geb22aceb5 (2021-05-03-20:31)
Licensed under GNU GPL v2
For bug reports, read
	http://openocd.org/doc/doxygen/bugs.html
Info : only one transport option; autoselect 'swd'
Warn : Transport "swd" was already selected
adapter speed: 5000 kHz

Info : Hardware thread awareness created
Info : Hardware thread awareness created
Info : RP2040 Flash Bank Command
Info : Listening on port 6666 for tcl connections
Info : Listening on port 4444 for telnet connections
Info : clock speed 5000 kHz
Info : SWD DPIDR 0x0bc12477
Info : SWD DLPIDR 0x00000001
Info : SWD DPIDR 0x0bc12477
Info : SWD DLPIDR 0x10000001
Info : rp2040.core0: hardware has 4 breakpoints, 2 watchpoints
Info : rp2040.core1: hardware has 4 breakpoints, 2 watchpoints
Info : starting gdb server for rp2040.core0 on 3333
Info : Listening on port 3333 for gdb connections
{% endhighlight %}
{% endfigure %}

### Set up a project for building

At this point the toolchain and debug tools should be ready to use, however before we configure VSCode we need an actual project to work with.  There are three main options here:
  1. Clone the [official example projects repository](https://github.com/raspberrypi/pico-examples).
  2. Create a new project manually, as described at the start of [chapter 8 of the official guide](https://datasheets.raspberrypi.org/pico/getting-started-with-pico.pdf#creating_your_own). 
  3. Create a new project using the official [Pico project generator](https://github.com/raspberrypi/pico-project-generator), as described in [chapter 8.3 of the official guide](https://datasheets.raspberrypi.org/pico/getting-started-with-pico.pdf#_automating_project_creation).

The example projects repository contains many small projects that demonstrate various aspects of the Pico, including simple ones such as `blink` and `hello_uart` that are perfect for checking that the PC's development setup is working correctly. I therefore chose the first option for this  guide, cloned the repository and opened it in VSCode.

Once the project has been opened, the `cmake` extension will ask you to select a compiler as described in [chapter 7.2](https://datasheets.raspberrypi.org/pico/getting-started-with-pico.pdf#vscode_loading_a_project). Make sure to select "GCC arm-none-eabi"; this should then appear in the toolbar at the bottom of VSCode.

### Configuring VSCode debug settings

Debug settings for VSCode projects are stored within a `launch.json` file, usually located within a folder called `.vscode` in the root directory of the project. More information about creating launch configurations can be found in the [official VSCode documentation](https://code.visualstudio.com/Docs/editor/debugging#_launch-configurations), however in our case the Pico example projects repository comes with a couple of example configurations, located within the `ide/vscode` directory, that we can use as a starting point. To use either of these files, they will need to be renamed to `launch.json` and moved inside the `.vscode` directory. 

The first example file, `launch-remote-openocd.json`, is intended to configure VSCode to connect to an external `openocd` process that is already running. This config file is slightly simpler, although it does requre `openocd` to be running in a separate terminal as it was earlier in this guide when we tested non-root USB access.  To configure this for Arch Linux, changing `gdbPath` to `arm-none-eabi-gdb` and `gdbTarget` to "localhost:3333" - or whatever port the `openocd` process started listening on when it was started, if this was not 3333 - should be sufficient. Below is the example file modified as described.

{% figure "VSCode <code>picoprobe</code> remote debug <code>launch.json</code> configuration file for Arch Linux"%}
{% highlight json %}
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Pico Debug",
      "type": "cortex-debug",
      "cwd": "${workspaceRoot}",
      "executable": "${command:cmake.launchTargetPath}",
      "request": "launch",
      "servertype": "external",
      "gdbPath" : "arm-none-eabi-gdb",
      "gdbTarget": "localhost:3333",
      "svdFile": "${env:PICO_SDK_PATH}/src/rp2040/hardware_regs/rp2040.svd",
      "runToMain": true,
      // Work around for stopping at main on restart
      "postRestartCommands": [
          "break main",
          "continue"
      ]
    }
  ]
}
{% endhighlight %}
{% endfigure %}

The above setup does work, although having to remember to keep `openocd` running separately is not ideal. Fortunately the second example file, `launch-raspberrypi-swd.json`, demonstrates how to configure VSCode to handle launching `openocd` automatically when debugging starts . As the name suggests, this file is aimed at development on the Raspberry Pi although it is straightforward to alter this for desktop development on Arch. The `configFiles` `interface` subfield needs to be corrected to `interface/picoprobe.cfg`, and `gdbPath` should be changed to `arm-none-eabi-gdb` as before.  Note that `openocd` needs to be able to run without root access in order for this setup to work, otherwise the remote debug configuration will have to be used.

{% figure "VSCode <code>picoprobe</code> debug <code>launch.json</code> configuration file for Arch Linux, with automatic <code>openocd</code> launching."%}

{% highlight json %}
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Pico Debug",
      "type": "cortex-debug",
      "cwd": "${workspaceRoot}",
      "executable": "${command:cmake.launchTargetPath}",
      "request": "launch",
      "servertype": "openocd",
      "configFiles": [
        "interface/picoprobe.cfg",
        "target/rp2040.cfg"
      ],
      "gdbPath" : "arm-none-eabi-gdb",
      "device": "RP2040",
      "svdFile": "${env:PICO_SDK_PATH}/src/rp2040/hardware_regs/rp2040.svd",
      "runToMain": true,
      // Work around for stopping at main on restart
      "postRestartCommands": [
          "break main",
          "continue"
      ],
    }
  ]
}
{% endhighlight %}
{% endfigure %}

Above is my `launch.json` with these changes implemented; this is the configuration I expect to use for future work with the Pico. I also chose to copy the `settings.json` file from `ide/vscode` in the example projects repository into `.vscode`; this is recommended as it tweaks the `cmake` plugin to ensure that it works with `cortex-debug` instead of trying to run Pico code on the host PC.

### Running a project

With VSCode configured, including the `settings.json` file from the example repository, the bottom bar should look something like the one shown below. There are three important fields to the right of the Git status and code warning information that are relevant to our project. The first is where we can toggle between debug and release/optimised builds, the second shows the compiler that `cmake` will use and the third shows the current launch target. 

{% figure "The bottom bar in VSCode, when fully configured." %}
{% image  "vscode_bottom_bar.png" "Example of a half-loaded image." 900 %}
{% endfigure %}

If the launch target selection is not yet visible, then VSCode should prompt you to select one when we attempt to start the debugger shortly. There are many possible launch targets to choose from in the examples repository, and a new target can always be selected by clicking on the entry in the toolbar, so for the sake of testing our setup the choice is not particularly important.  In the screenshot above I currently have "blink" selected as the traditional demo for testing a new board; the "hello_uart" example would also be a good option for testing `picoprobe`'s USB serial passthrough. 

For the final test of our setup, we can now switch to the "Run and Debug" view by selecting the 4th entry on the left-hand bar and then hit the green arrow next to "Pico Debug" at the top left.  If all goes well, a view similar to the screenshot below should appear:

{% figure "VSCode caught in the act of debugging the Raspberry Pi Pico." %}
{% image  "vscode_debugging.png" "Example of a half-loaded image." 800%}
{% endfigure %}

Here we can see that the bottom bar has turned orange, indicating that debugging is active, and a set of debug navigation controls have appeared at the top of the window.  On the left are the standard lists of breakpoints, variables and the call stack for debugging, as well as the ability to view the state of all of the Pico's peripheral registers - a crucial feature for an embedded development IDE. Stepping through the code works as expected, as do breakpoints and the register value viewer.

### Conclusion

I found the process of setting up a development environment for the Raspberry Pi Pico to be quite straightforward and painless.  The documentation is good, and having official support for embedded development in a modern IDE is a rare treat in my experience so I am very much looking forward to working with the Raspberry Pi Pico in future projects!