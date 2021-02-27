---
title: "OpenWindow: open-source car electric window controller (part 1)"
author: Alan Reed
date: 2021-02-15
description: "OpenWindow is a project to create an open-source controller for my car's electric windows. This post originally appeared as a Project14 competition entry, where it won a runner-up prize."
tags:
  [
    OpenWindow,
    electronics,
    software,
    embedded,
    car,
    Skoda Felicia,
    efm8,
    project14,
  ]
layout: layouts/post.njk
---

### Foreword

This post first appeared as a competition entry for the Project14 Control Systems competition in October 2020, where it won a runner-up prize. The original competition entry can be found [here](https://www.element14.com/community/community/project14/controlsystems/blog/2020/10/13/openwindow-open-source-car-electric-window-controller).

### Introduction

Some time ago, I replaced the electric window mechanism in the driver's door of my car. The new part was of a different design to the old, and had no controller - just a 2-wire motor. Universal electric window controllers that do anything beyond simple switching, such as stall detection etc., don't seem to exist so in the end I stripped the controller out of the old mechanism (pictured below) and connected it to the new one.

<figure>
  <img src={{ date | formatImagePath: "old_connector.jpg" }} alt="Old window controller." >
  <figcaption>My car's original electric window controller.</figcaption>
</figure>

This sort of worked, although because the new motor was different the controller was not happy. The window would only move in 2" increments before stopping, presumably because the controller believed it was stalling. Additionally, pressing and holding the switch with the window open or closed to teach the controller where the window limits were would result in a window that wouldn't open at all. However, being short of time I decided that this would be "good enough for now" and made a note to make a replacement controller in the future.

Fast-forward to a month ago, I discovered the Element14 competitions here and saw that the current competition was for a control system. This provided the motivation I needed to start work on a better solution, and so I can now present as my entry OpenWindow: an open-source car electric window controller.

### Specification

A suitable replacement window controller must achieve the following:

- Monitor the state of the window switch for user input
- Switch the high current for the motor between off, forward and reverse as needed
- Detect when the window is fully open, closed or obstructed and turn off the motor
- Only draw power when the ignition is on

The window controller connects to my car's wiring harness through a five-pin connector inside the door. Thanks to the people over at the Briskoda.net forums, I have a handy diagram of the pinout for this connector in my car:

<figure>
  <img src={{ date | formatImagePath: "connector.gif" }} alt="Skoda Felicia window controller connector pinout." >
  <figcaption>Skoda Felicia window controller connector pinout.</figcaption>
</figure>

GND and +BATT supply +12V power to the controller, and are always connected. IGN is switched to +12V when the car's ignition is on, and is 0V otherwise. Finally, the connection to the window switch is pulled to +12V when the switch is moved to raise, 0V when the switch is moved to lower, and left unconnected otherwise.

The window motor has just 2 wires connected to the controller for power, so there is no position information available there. There are no sensors at the end stops of the window track to notify when the window is fully open or closed either. Time also cannot be used to determine how far the window has moved with any accuracy, as the speed of window movement varies significantly due to factors such as temperature and battery voltage. The only feedback I have available from the window is the current drawn by the motor. Fortunately, this should be sufficient as when the window reaches its limit (or is obstructed), the motor will stall and significantly increase its current draw. By monitoring the current supplied to the motor when it's running, I should be able to detect when the window stops moving and shut off the motor.

### Design - electronics

For flexibility, and to compensate for my limited skill in electronics, the brains of the operation will be a microcontroller. Having previously read about the EFM8 series of 8-bit microcontrollers from Silicon Labs in a Hackaday article, I decided that this project would be a good opportunity to try them out. For the prototyping presented here I used an EFM8BB2 "Busy Bee" development board that I had previously bought but not yet got around to using.

The window switch is a three-state input (12V, floating, 0V), so I needed to drop the voltage down logic levels and work out how to detect the floating state. I decided that the easiest way would be to use a couple of comparators (built into the EFM8) along with a voltage divider. When the switch is floating, the voltage divider network pulls the comparator input to ~1.5V. On switching to 0V the comparator input is pulled to 0V and on switching to 12V it is pulled up to 3V. By using two comparators with rising and falling edge detection, one with a reference voltage of 1V and the other 2V, the EFM8 can successfully detect all of the switch states and transitions between them. I've included a rough diagram below to help visualise how this works.

<figure>
  <img src={{ date | formatImagePath: "comparator_diagram.jpg" }} alt="Diagram of switch state detection using comparators" >
  <figcaption>Diagram of switch state detection using comparators.</figcaption>
</figure>

To monitor the motor current, I selected a Hall-effect current sensor (Allegro ACS712). Using a sense resistor with amplifier for the task would have been difficult, as the motor current pretty large when stalled (>13A) and so any sense resistor would potentially have dissipated quite a lot of power. From what I read, I also got the impression that one had to be quite careful with component layout when connecting a measurement amplifier to the sense resistor so I decided to steer clear of this entirely.

I ended up purchasing the current sensing chip on its own breakout PCB, as this was significantly cheaper than picking up the chip by itself - not to mention more convenient as it's a surface mount chip. Most Hall-effect current-sense chips, including the one I chose, seem to run on a 5V supply and provide a 0-5V output proportional to the detected current. I then converted this down to logic level ready for input to the EFM8's ADC using another voltage divider. According to the datasheet, the minimum resistive load of the current sensor output was 4.7KOhm, and initially I assumed that this would refer to the total resistance of the voltage divider. When running the ADC, I found that this was not the case and had to switch the divider resistors out for larger values to avoid pulling down the current sense output.

For the ignition switching, I used a MOSFET high-side switch to control the 12V supply for the electronics from the ignition input. Unfortunately, I found the 2N7000 FETs very easy to damage even when wearing an ESD wristband - luckily I had plenty spare. From the switched 12V supply I ran a small LDO regulator to supply 5V for the current sensor. When I make the final version, this 5V supply will also power the EFM8. Currently the dev board normally runs off of USB power, although it can be connected to the 5V supply instead if debug output isn't required.

Prior to the ignition switching circuit, I included in the design a TVS diode and N FET for transient spike and reverse polarity protection just in case, as the car electrical system can be a harsh environment. Finally, for the motor control I used a couple of SPDT automotive relays, switched by the EFM8 through a couple of small NPN transistors with flyback diodes across the coils. The complete circuit diagram for the prototype is shown below.

<figure>
  <img src={{ date | formatImagePath: "schematic_v2.png" }} alt="OpenWindow prototype schematic" >
  <figcaption>OpenWindow prototype schematic.</figcaption>
</figure>

Here is the complete prototype assembled on the desk:

<figure>
  <img src={{ date | formatImagePath: "prototype.jpg" }} alt="The completed OpenWindow prototype" >
  <figcaption>The completed OpenWindow prototype.</figcaption>
</figure>

### Software development

With the hardware design completed, it was time to start on the software to bring it all together. Silicon Labs provide a free IDE for software development for these chips, the Eclipse-based Simplicity Studio, which was part of the reason I wanted to try these chips out as it was supposed to be quite good. EMF8 chips are based on the 8051 architecture, which I've never worked with, and it had been a while since I last did any embedded development so I was definitely a bit rusty. I found the 8051 to be quite different to previous chips I've used, and definitely ran into some pitfalls during development as a result.

As is tradition, the first thing I did once I started working on the software was to develop a basic serial-port driver for text output. This was interrupt-driven to minimise the impact of printing debug output while the device has other things to do and here I hit my first pitfall: 8051 functions are by default not reentrant. If an interrupt occurred in the middle of a function, and called that same function, then the function's arguments would be overwritten. After some reading of the C51 compiler notes online, I learned that you can change this for specific functions using the "reentrant" keyword if needed, taking a performance hit in the process.

Having sorted the text-based debug output, I focussed on getting the other necessary peripherals working. I found that the Hardware Configurator built into Silicon Labs' IDE came in very handy for this. The tool made it easy to see all of the options available for each peripheral, and generated the necessary initialisation code for setting configuration registers without any extra unnecessary stuff or forcing prewritten drivers upon the project. It also would notify you of errors in your chosen configuration, preventing easy mistakes. This saved a lot of time flipping through the datasheet to work out all of the necessary register addresses and values!

After getting all of the peripherals tested and working individually, I needed to tie everything together and make the control logic. As is often the case for embedded systems, I decided to use a simple state machine for this as diagrammed below.

<figure>
  <img src={{ date | formatImagePath: "State_machine.png" }} alt="OpenWindow state machine diagram" >
  <figcaption>OpenWindow state machine diagram.</figcaption>
</figure>

Here I hit my second major pitfall. I initially wrote a fancy state-machine for my system, involving judicious use of structs and function pointers. When I came to try it out, I found that the absence of a certain print statement (even if completely empty) would cause the chip to constantly reset. After much debugging and head-scratching, I read online that function pointers on the 8051 are apparently something to be handled sparingly and with care. Eventually, having still been unable to fix it I decided to lose the day's work and write a simpler implementation, rather than risk the flakiness of the more complex one. The simple state machine does not have a queue for events, relying on events being quite infrequent in this system.

The final stage in the project was to test the prototype in the car, to work out some empirical current limits for the window motor. As is often the case with automotive electronics, the connector for the window controller on the wiring harness is a strange waterproof connector that is hard to get hold of. For the final product I should be able to pick one up from China, but the lead times are very long. Thus, for the purposes of testing the prototype for this competition, I jury-rigged an interface out of some sections of old packing staples. Below is a photo of the final prototype balanced on a seat in the car, ready for testing.

<figure>
  <img src={{ date | formatImagePath: "in_car.jpg" }} alt="OpenWindow prototype in car ready for testing" >
  <figcaption>OpenWindow prototype in car ready for testing.</figcaption>
</figure>

### Results

After setting some appropriate current limits, the prototype controller worked quite well! One change I made after initial testing was to make the state machine more tolerant of unexpected events, as I had initially set it to enter a permanent error state if any occurred. Such events could occur during power-on, or if we are very unlucky and two events happened to occur in very close succession due to my simple control logic. The system now reports the error, then returns to idle instead of locking up.

For the final product I will need to have a go at designing a PCB, as the EFM8 is only available in surface mount packages so stripboard isn't an option. I may also add some extra functionality, such as a single click to raise or lower the window fully, however I ran out of time to do these before the end of the competition.

Below is a video of the prototype in action, as proof of my work for the competition. There's also a link to the project on GitHub, where the software and schematics are available if people are interested.

<div class="youtube-video-container">
  <iframe 
    src="https://www.youtube.com/embed/QUyG3emrrRg" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div class="youtube-video-container">

[Link to project GitHub.](https://github.com/alanpreed/OpenWindow)

Thanks for reading!
