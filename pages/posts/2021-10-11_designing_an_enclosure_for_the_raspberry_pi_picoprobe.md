---
title: "Designing an enclosure for the Raspberry Pi picoprobe"
author: Alan Reed
date: 2021-10-11
description: "An experiment in enclosure design, with the aim of creating a 3D printed case for a Raspberry Pi Pico programmed with picoprobe.  My most complex CAD work to date, and my first attempt at using threaded inserts with 3D printed parts."
tags: [raspberry pi pico, cad, hardware, 3D printing]
layout: layouts/post.njk
---

### Introduction

[Picoprobe](https://www.raspberrypi.com/documentation/microcontrollers/raspberry-pi-pico.html#debugging-using-another-raspberry-pi-pico) is an official firmware image available for the Raspberry Pi Pico, which turns the board into a debugger and programmer for another Raspberry Pi Pico.  I used this successfully during a [previous project](posts/2021-07-14_implementing_composite_video_output_using_the_pi_picos_pio/), however I was unsatisfied with the pile of floating jumper cables and Pico PCBs that I ended up with.  

{% figure "Picoprobe connected up using jumper wires, and connected up using the finished enclosure." %}
{% image  "picoprobe_jumpers.jpg" "Picoprobe connected up using jumper wires." 350 %}
{% image  "finished_debugging.jpg" "Picoprobe connected up in finished enclosure" 428 %}
{% endfigure %}

In addition to being a bit of a mess, the jumper approach was fiddly to hook up and easily disconnected.  This post documents my attempt to improve upon it, by designing and 3D printing an enclosure for a picoprobe-flashed Pico that provides convenient access to all of the necessary features.


### Requirements

The Pi Pico is debugged using a Serial Wire Debug (SWD) connection, which requires at a minimum three connections: SWIO, SWCLK, and GND.  Additionally, the picoprobe can provide power to the device being debugged. According to [Appendix A of the Getting Started guide](https://datasheets.raspberrypi.org/pico/getting-started-with-pico.pdf#picoprobe-wiring-section), this should connect VSYS to VSYS, unless the debugged device is using its USB port in device mode in which case VBUS should be connected to VBUS.  The final design should allow the user to switch between the two voltage sources as needed.

An optional serial port passthrough is provided by the picoprobe firmware too, allowing the picoprobe to operate as a USB serial adapter while also debugging a device. This requires a further three connections, TX, RX and GND, which should be available on a separate connector to the debug interface.

{% figure "Kicad schematic of picoprobe electrical connections. Pico footprint sourced from <a href='https://github.com/ncarandini/KiCad-RP-Pico/'>Github</a>" %}
{% image  "picoprobe_schematic.png" "Schematic showing picoprobe electrical connections." 500%}
{% endfigure %}

Both the button and the LED on the Pi Pico PCB should also remain accessible once the Pico is installed in its case.  I don't believe that picoprobe currently makes use of the button, however access to it will be necessary if the pico's firmware ever needs updating. Visibility of the LED is important as it shows when the picoprobe is powered up. Finally, I'd like the case to be generally rugged enough to survive being knocked about on a desk or in a drawer, as is likely to happen once its assembled.

### Design
Inspired by an article I encountered on [Hackaday](https://hackaday.com/2019/02/28/threading-3d-printed-parts-how-to-use-heat-set-inserts/), I decided that I wanted to try using threaded inserts for the enclosure assembly. The only 3D printed case I'd made before, for [my car's window controller](/posts/2021_03_21_openwindow_open_source_car_electric_window_controller_part_2/), was held together using clips as there wasn't room for bolts. These worked well enough, but were less solid than I'd like for a durable tool casing. Bolts with regular nuts in retaining holes would provide the necessary strength, however in my opinion threaded inserts should have a couple of important advantages over these.  Assembly and disassembly will be much easier, as there won't be any loose nuts to keep track of, and the design will be simpler too as all the inserts require is a simple blind hole.  As an added bonus, inserts allow the use of shorter (i.e. cheaper) bolts as the threads finish flush with the surface. In my opinion, they also make the finished product look rather smart.

As has become a habit for me, after deciding to use threaded inserts I ordered a cheap assortment pack from eBay China. I also purchased an installation tool - essentially just a non-tapered soldering iron tip - on the recommendation of the Hackaday article, although in hindsight this wasn't really necessary as the regular iron bits work well enough too.

{% figure "Threaded inserts, installation tool and a fitted insert." %}
{% image  "inserts.jpg" "Threaded inserts and installation tool." 300%}
{% image  "installed_insert.jpg" "Threaded insert fitted into a 3D printed part." 371%}
{% endfigure %}


I ended up using inserts both to hold the lid on, and to mount the Pi Pico inside the case.  The latter needs to be firmly held in place in order to withstand repeated connection and disconnection of the Pico's USB cable, and I felt that this solution would be stronger (and simpler to design) than restraining the Pico with the print alone.

The inserts I ordered were of a different design to those in the article, and came with no guidance on installation hole dimensions. As a guess I tried using the radius of the central smooth section, and this seemed to work well for the M2 (Pico) and M2.5 (lid) inserts I used here.  It was also important, as mentioned in the article, to make the installation holes deeper than the length of the insert. Otherwise, the displaced plastic filled up the inside of the insert - ask me how I know...

{% figure "JST XH connectors and slide switch mounted to the walls of the 3D printed case." %}
{% image  "connectors_and_switch.jpg" "JST XH connectors and slide switch mounted in 3D-printed case." 400 %}
{% endfigure %}

For the external electrical connections to the picoprobe, I turned again to my cheap assortment of JST XT connectors.  I mounted these to the side of the case using small pieces of stripboard bolted to 3D-printed pillars on the walls. These horizontal pillars didn't print perfectly round, but they were solid and a lot easier to use than separate spacers. The voltage source switch is a single pole double throw (SPDT) slide switch from [CPC](https://cpc.farnell.com/eao/09-03290-01/slide-switch-spdt-vert/dp/SW03106?CMP=TREML007-005), mounted in the same way. I've linked the actual switch here for future reference because, unlike most of the slide switches I could find, this one has a pin spacing of 0.1" making it suitable for standard stripboard.   

Light from the indicator LED is delivered to the case exterior by a piece of 3mm light pipe that I had lying around from a previous project, friction-fitted inside a tube printed as part of the lid.  The button is operated using a 3D-printed cylinder fitted inside another such tube, with a flange on the cylinder to prevent it from sliding out of the case.  To my mild surprise I got the length of the cylinder and position of the flange right first time, achieving a satisfying button-clicking action without excessive play - a testament to accurate measurements and a parametric CAD design, I suppose.

{% figure "Underside of the lid, showing the installed light pipe and base of the button presser." %}
{% image  "light_pipe_and_button.jpg" "Underside of the lid, showing the installed light pipe and base of the button presser." 400%}
{% endfigure %}

As a final finishing touch, I had a go at adding the Raspberry Pi logo to the lid along with a text label. I'd hoped to be able to use an SVG of the Pi logo, however OpenSCAD would only render the outermost contour of the logo when imported. I couldn't find an easy solution to this, so instead I ended up using a 3D model I found [on Thingiverse](https://www.thingiverse.com/thing:3099888/files). Text was generated using OpenSCAD directly, although some trial and error was required to determine a font size large enough for all detail to actually show up once the model was sliced. The lid is printed top side down, so by default the logo and text would be filled with infill. This infill cannot be removed as the indentations are too shallow, although the text is still legible with it present.  After some testing I found that the infill wasn't necessary, and removing it made the inlay slightly clearer so I printed the final version without it.

{% figure "CAD model of lid inlay, and the 3D-printed result with (left) and without (right) support material." %}
{% image  "lid_top_cad.png" "CAD model of lid inlay." 300 %}
{% image  "lid_top.jpg" "3D-printed lid inlay, with and without support." 459 %}
{% endfigure %}


### Results

An exploded view of my final CAD model can be seen below, along with the finished assembly.  Although they take away from the cleanness of the end product, I decided that adding some labels would be a good idea so that I can actually remember what all of the parts do in future. If I had a label printer then it might look more professional, but we make do with what we have.

{% figure "CAD model of the final design, and the finished unit with labels." %}
{% image  "case_cad.png" "CAD model of the picoprobe enclosure" 400%}
{% image  "finished_labels.jpg" "The finished picoprobe enclosure, with labels." 370%}
{% endfigure %}

The leads were made up using more JST XH connectors, as well as some standard female 0.1" headers, and can be seen in the final photo below. I made the serial connector match the pinout of an FTDI cable, as these seem to crop up a lot and it can't hurt to be compatible.  The debug lead looks slightly strange, because I kept the VOUT pin separate with enough of a flying lead for it to be able to reach the VBUS/VSYS pins on the Pico when the debug header is connected.  Of course, because both cables can be disconnected from the enclosure it would be simple to make up some new leads with a different format, should such a thing be required in future.

{% figure "The completed picoprobe enclosure with leads plugged in." %}
{% image  "finished_wires.jpg" "Picoprobe enclosure with leads."  400%}
{% endfigure %}

I'm very happy with how this enclosure design has panned out. It's my most complicated 3D print yet, and it successfully included several features that I'd never tried before such as the threaded inserts and inlaid text. With any luck, I'm hoping that this design may be able to serve as a base for future projects using the Pi Pico too. 

STL files for the enclosure parts, as well as the OpenSCAD scripts used to generate them, can be found on [this project's Github](https://github.com/alanpreed/Picoprobe-enclosure).
