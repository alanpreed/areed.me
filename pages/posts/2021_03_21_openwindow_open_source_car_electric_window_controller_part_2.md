---
title: "OpenWindow: open-source car electric window controller (part 2)"
author: Alan Reed
date: 2021-03-21
description: "OpenWindow is a project to create an open-source controller for my car's electric windows. This post covers the transition from working prototype to finished product, including PCB and case design and assembly."
tags:
  [
    OpenWindow,
    electronics,
    software,
    hardware,
    CAD,
    3D printing,
    embedded,
    car,
    Skoda Felicia,
    efm8,
    project14,
  ]
layout: layouts/post.njk
---

### The story so far

Last year I started a project to create an open-source controller for my car's electric windows, dubbed OpenWindow. I was able to create a working prototype based on a Silicon Labs EFM8 development board, and entered the writeup into a Project14 competition where it won a runner-up prize. While the prototype was fully functional, being assembled on breadboard connected to a development board meant that it was not suitable for permanent installation.

This post documents the second stage of the project, where I take the prototype design developed previously and convert it into a finished product that is fitted inside my car.

{% figure "The prototype controller from last post, and the finished unit prior to installation." %}
{% image  "prototype.jpg" "Openwindow prototype from previous post."  %}
{% image  "finished_closed.jpg" "OpenWindow final product." %}
{% endfigure %}

### Custom PCB design

The first step in the development of a more permanent design was the replacement of the breadboard/devboard combo with a custom PCB. I'd previously drawn the schematic for the prototype project in KiCad, so I used this as a starting point for the new board. My previous projects have all been based on breadboard or stripboard, so most of my component stocks were through-hole and I therefore chose mostly through-hole components for this design to minimise new purchases. The EFM8 microcontroller was a surface-mount package by necessity; I chose the only version available that actually had leads as my lack of a hot air gun or reflow oven meant that the PCB would need to be assembled with only a soldering iron. I did also use some surface-mount passive components for the EFM8 reset and power supply circuitry, as I thought I might reuse these in future projects.

JST XH connectors were chosen for the connections from the main PCB to both the car door and the current measurement PCB. Previously I've always used ungendered 0.1" headers for board connectors, assembling cables by soldering wires onto the pins of 0.1" header sockets cut to the appropriate size. The process was a bit of a faff, but had the advantage that it required no special tools and could easily be scaled to any number of pins. I'd used various crimp connectors at work before, but steered clear of these at home because the crimping tools tended to be very expensive. Recently I stumbled upon a very cheap assortment of JST XH connectors, complete with ratcheting crimp tool, from eBay China and I decided to buy one as an experiment. Just £21.79 nabbed me a knockoff crimp tool and a 900-piece assortment of 2-10 pin XH connectors. Despite the price the crimp tool seemed to be quite well made and worked perfectly when tested, so I'll definitely be using these wherever possible from now on.

Pheonix screw contacts were used for the relay coil connections, because the cables from the relay sockets were far too thick to fit in the JST crimps. The debug and FTDI compatible serial port headers were kept as regular 0.1" headers; neither would be used enough to justify a fancy connector and the latter needed to use this style of connector to be compatible with the FTDI lead anyway.

Laying out the PCB did take me a few attempts, as I had only limited previous experience with this and so there was a fair amount of rearranging before I arrived at something sensible. On the recommendation of a friend I ordered the boards from JLCPCB, one of many Chinese PCB manufacturers, and I was very impressed with the results. The boards were amazingly cheap and arrived remarkably fast given that they were shipped from China, so I'll definitely be using custom boards more in future projects!

{% figure "The custom PCB manufactured by JLCPCB." %}
{% image  "ordered_pcb.jpg" "The custom PCB manufactured by JLCPCB." %}
{% endfigure %}

### Custom enclosure design

With the PCB ordered, I turned my attention to the casework. In addition to the PCB, this also needed to contain two bulky automotive relays, the small current measurement PCB, and some way to accept the external connections from the car door and window motor. I decided to fit the new controller inside the interior door card in the car, instead of within the metalwork like the old one, as this gave me more room and was a less harsh environment. Most notably, there shouldn't be any water to contend with there! Despite the extra room, the bulky relays and my relatively large PCB meant that fitting everything in was still quite a challenge.

To make the most of the limited space, I chose to use a custom design rather than modifying an off-the-shelf box. The case and lid were modelled using OpenSCAD, and fit together using cantilever clips. I'd hoped to make a case that screwed together, however there wasn't enough room to fit pillars for bolts. I'd not made a cantilever clip system before, so I designed the clips to be quite chunky with a supporting rib as I was concerned that they would snap.

{% figure "The 3D printed case and lid for the OpenWindow unit." %}
{% image  "case_model.png" "3D printed case for OpenWindow unit."  %}
{% image  "case_lid_model.png" "3D printed lid for OpenWindow unit." %}
{% image  "case_closed_model.png" "3D printed case with lid for OpenWindow unit." %}
{% endfigure %}

In the final design, the relays sit alongside the PCB with the small current measurement PCB mounted on one sidewall. On the base of the case, under the main PCB, is a 6-way terminal block for connecting the cables from the car door. I originally planned to use panel-mount connectors for this, but couldn't find any with a sufficiently high current rating for the window motor so I elected to build the enclosure with flying leads and inline connectors instead. The relays are held in place by a small block that protrudes from the lid down into the case. This presses down on the relays to prevent vertical movement, and also prevents them sliding forward due to a raised plastic lip on the main relay body that sits between the block and the case wall.

Once the design was finalised I 3D printed it using a Crealty Ender 3 Pro. This was my first 3D printer and I've only owned it for a few months, so the lid and case were by far my largest prints yet attempted - together they took over 9 hours to print. They came out quite nicely though, and clips worked well too. I did have to make judicious use of a needle file on the clip edge and the holes in the case to make them fit properly, but I'd rather that than a sloppy fit. Similarly, although the bolt holes were printed with countersinks I did have to run a countersinking bit over them all before the bolts sat fully flush.

{% figure "The 3D printed case and lid for the OpenWindow unit." %}
{% image  "case.jpg" "3D printed case for OpenWindow unit."  %}
{% image  "case_lid.jpg" "3D printed lid for OpenWindow unit." %}
{% image  "case_closed.jpg" "3D printed case with lid for OpenWindow unit." %}
{% endfigure %}

When I designed the case, I intended to mount the current PCB on a couple of nylon spacers and simply use a couple of nylon nuts on the top side. This didn't work in practice, as the tiny clearance between the mounting holes and the components on the PCB meant that nuts just wouldn't fit without applying the clamping force through the actual components. Using the nylon spacers also meant that the board was very poorly supported, as the only mounting holes were in the center of the board. Fortunately, as anyone who owns a 3D printer knows, the application of a 3D printer can solve all problems. I designed a spacer, with cutouts for the pins of the through-hole components, to support the PCB, and an n-shaped clamp that fitted over the offending component on the PCB allowing the retaining nuts to be tightened down safely.

{% figure "The original plan for mounting the current measurement PCB, my 3D printed clamp and spacer, and the improved fit when these were used instead." %}
{% image  "pcb_old_mounted.jpg" "Current measurement PCB fitted using nylon nuts and spacer."  %}
{% image  "pcb_mounts.jpg" "3D printed clamp and spacer for improved fit." %}
{% image  "pcb_new_mounted.jpg" "Current measurement PCB fitted using 3D printed clamp and spacer." %}
{% endfigure %}

### Assembly and wiring

Once the PCB was assembled (after waiting for the parts I forgot to order) and the case was printed, I needed to make up the wiring necessary to connect everything inside the case as shown in the diagram below.

{% figure "Openwindow enclosure wiring diagram." %}
{% image  "Case_wiring_diagram.png" "Openwindow enclosure wiring diagram." 600 "png" %}
{% endfigure %}

The relays were easiest, as the sockets for these already had wires installed that just needed to be cut to length. Once they were in I had to replace the 0.1" header on the current measurement PCB with a JST connector, as the standard headers were too tall and would conflict with the relay sockets. Fortunately the JST XH connector was just short enough to squeeze into the gap, making the cable for this a simple 3-wire affair between two JST XH connectors. For the input to the main PCB I used some heavier gauge wire, as the main board needs to supply some current to the relay coils.

Prior to the insertion of the flying leads I fitted a rubber grommet into the hole in the case, for protection from the case edges. To connect these leads from the controller to the car I ended up using the same inline automotive connector as the original controller (VW part numbers 357 972 755/357 972 765, can be found on Aliexpress). Unlike the old one, mine also needed a connector for the window motor - this wasn't present on the original unit as it mounted directly to the motor. Again I struggled to find a suitable connector, so I ended up choosing the 2-pin variant of the original controller connector (VW part numbers 357 972 762/357 972 752, also on AliExpress). These are both chunky waterproof connectors, with flat spade-like terminals large enough to be easily assempled with a manual terminal crimper. They come with a little rubber bung, which it's important to remember to thread onto the wire before the crimp is fitted!

Below are a couple of photos of the completed wiring harness, with and without the main PCB so that the terminal block connections are visible, and a photo showing the flying leads with the inline connectors fitted too. I apologise for the strange wiring colour choices, unfortunately my stocks of cable were limited - particularly for the heavy-gauge power inputs - so I used whatever I could find. The positions of the JST connectors on the board are also not entirely ideal given the final positions of the various components in the case, a consequence of designing the PCB before the enclosure!

{% figure "The wiring inside the case, before and after the main PCB was fitted, and the complete unit with inline connectors. Spot the wiring mistake!" %}
{% image  "wires_in.jpg" "Wiring within the OpenWindow case, without main PCB."  %}
{% image  "pcb_in.jpg" "Wiring within the OpenWindow case, with main PCB." %}
{% image  "finished_open.jpg" "The finished unit with the inline connectors fitted to its flying leads." %}
{% endfigure %}

### Programming the assembled PCB

To program the board I intended to use the EFM8 development board that featured in the prototype, as this has the capability to program and debug external devices. Standalone Silicon Labs EFM8 USB programmers were around £40 at the time of writing, so it made sense to make do with what I had. The debug header on the development board is a 20-pin 0.5" Samtec connector, and ribbon cables that fit this were also surprisingly expensive. Instead I just purchased a compatable 0.5" pitch Samtec connector and assembled my own lead. This converted between the 20 pin header on my development board, and the 0.1" debug header on my custom PCB. 

{% figure "The EFM8 development board and custom debug lead that I used to program the chip on my PCB." %}
{% image  "debug_adapter.jpg" "The EFM8 development board and custom debug lead that I used to program the chip on my PCB." %}
{% endfigure %}

Originally, the above lead only had 3 wires. When designing my PCB I read in the [Silicon Labs 8-bit USB debug adapter user's guide](https://www.silabs.com/documents/public/user-guides/8-bit-USB-Debug-Adapter.pdf) that for programming and debug of EFM8 chips via their proprietary C2 interface, a minimum of 3 pins were needed: ground, C2 clock and C2 data. Unfortunately, when I came to program my newly assembled board using the debugger on the development board I couldn't get it to work. It turned out that in [this guide](https://www.silabs.com/community/mcu/8-bit/knowledge-base.entry.html/2015/06/08/how_to_use_efm8_star-8aHu) to using the EFM8 starter kit as an external debugger/programmer, it was stated that a fourth pin connected to the supply voltage of the target board was also needed! Luckily due to all of the through-hole components on my PCB it wasn't too hard to add a patch wire from a 3V3 connection out to an extra header pin, which I epoxied inline with the 3 pin header already present on the PCB.

{% figure "Addition of an extra pin to the debug header on the PCB, to make VTARGET available to the debugger." %}
{% image  "pcb_mod.jpg" "Addition of an extra pin to the debug header on the PCB, to make VTARGET available to the debugger." %}
{% endfigure %}

I was then able to program the EFM8 on my custom board - except I wasn't, because the Keil license I had in Simplicity studio had stopped working with an "R201" error code. According to [their site](https://www.keil.com/support/man/docs/license/license_errors.htm) this was likely due to updates to my PC's OS invalidating the unique machine identifier provided to Keil when the license was regisered, which was frustrating. There was no easy way to set up a new license in Simplicity Studio either. In the end I had to uninstall the toolchain within Simplicity Studio, manually delete the folder where it was located on disk, reinstall the toolchain and then register for a new license with Keil.

With that out of the way, I remembered that I needed to reconfigure the Simplicity Studio project to build for the part on my custom PCB, as I'd used a different EFM8 package to the one on the development board. Altering this in the settings was easy enough, once I found the right area (project properties -> C/C++ build -> Board/Part/SDK), however I also needed up update the Hardware Configurator. I couldn't find any way to change parts within their tool, so in the end I had to remove the hardware configuration file and create a new one. Examining the contents of the old and new files, I could see that the actual settings were stored as XML data and could be copied between them. As all of the port pins used were the same on both the development board and my PCB, I didn't have to change anything further and the board was finally programmed successfully.

### Final assembly

The programmed board was tested briefly on the desk, although as I didn't have anything set up to spoof the current measurement inputs this was mostly limited to checking that the board turned on and off and that serial output was being generated by the microcontroller. The acid test came when I plugged the unit into the car itself, and used it to drive the window motor.

There were a few teething issues at this point that I had to iron out. On the first test I discovered that I'd crossed the switch and ignition input wires on the terminal block in the unit, which meant that the unit switched on when the window switch was pressed. I missed this when I took the wiring photo above, so you can see where the grey and purple wires are mixed up. Having corrected this, I then found that the relay connections to the window motor were backwards. Pressing the switch to lower the window would therefore raise it, and vice versa. Finally, I'd also inadvertantly swapped the current sensor leads around. As this sensor measures current bidirectionally, the acceptable current ranges for raising and lowering the window are completely different so the unit would immediately hit the preprogammed stall current limits in either direction. Fortunately all of these issues were easily fixable, but still a valuable lesson that I should be more careful with labelling in future!

Aside from checking the basic operation of the window, I also needed to be certain that when the ignition was switched off the unit would power down and draw no current. The last thing I wanted was for the window controller to kill the car battery as soon as I left it alone for a few days. I therefore hacked together an adapter cable that allowed me to connect a current meter in series with the unit, and measured the draw by the unit with the ignition off and on. Below is a short gif of the result, where we can see that the current consumption was indeed zero with the ignition off. Success!

{% figure "Testing the current draw of the unit in the car with the ignition on and off (scale is in mA)." %}
<img src={{ date | formatImagePath: "current_test.gif" }} alt="Testing the current draw of the unit in the car with the ignition on and off (scale is in mA)." >
{% endfigure %}

With the various wiring issues solved, and having confirmed that the finished unit was fully operational, I fixed up the waterproofing membrane on the door and fitted the controller into its new resting place in a convenient space on the inside of the inner door card. Some supporting foam was added around the case, to help hold it in position while the card was refitted and to protect it from knocks and vibration once installed.

{% figure "The finished unit fitted with some foam padding inside the interior door card. The visible face of the unit was also covered with foam before the door card was reinstalled." %}
{% image  "in_door.jpg" "The finished unit fitted with some foam padding inside the interior door card." %}
{% endfigure %}

After connecting up the unit and refitting the door trim my electric windows are now finally working properly again, and will hopefully continue to do so for a good few years to come! The PCB schematics and layout, enclosure CAD designs and EFM8 software for the finished product can all be found on the OpenWindow GitHub repository [here](https://github.com/alanpreed/OpenWindow).

Thanks for reading!
