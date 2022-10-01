---
title: "Kitchen scales USB charging conversion"
author: Alan Reed
date: 2022-09-30
description: "My digital kitchen scales were powered by a disposable coin cell, which never seemed to last very long.  I grew tired of throwing away batteries all the time, so I converted the scales to contain a larger battery that could be recharged via USB."
tags: [electronics, hardware]
layout: layouts/post.njk
---

### Introduction

Well it's certainly been a while since I've had the time to write up anything on here! This post covers my conversion of the power supply for a set of kitchen scales, from disposable CR2032 coin cells to an internal lithium cell that was rechargeable via USB. The kitchen scales in question are a cheap set [sold by Argos](https://www.argos.co.uk/product/8476887), a UK retailer who sell a broad range of consumer goods, and are pictured below with and without the top pan fitted. 

{% figure "The weighing scales pre-conversion, with and without the top pan fitted" %}
{% image  "pan_on_before.jpg" "Weighing scales with top pan" 300%}
{% image  "pan_off_before.jpg" "Weighing scales without top pan" 300%}
{% endfigure %}

I'm mildly surprised that identical scales are still available, if rebranded from the Argos Value Range to Argos Home, as I've probably owned my set for almost ten years.  For much of that time they saw only sporadic use, however during the COVID-19 pandemic I started using them a lot more than I had before and found that I was burning through my supply of coin cells at an unpleasant rate. There was plenty of space inside the unit, as can be seen in the second photo,  and so I decided to attempt to fit a rechargeable battery instead.


## Requirements

Most importantly, the voltage supplied to the scales via the conversion must match that supplied by the original non-rechargeable CR2032 cell. These are lithium primary cells nominally rated at 3 V, although this will vary from roughly 3.6 V down to as low as 2 V once depleted.  A cell's voltage is determined by its chemistry, which will be different for a rechargeable cell, so a voltage regulator will be required in order to supply the correct voltage to the scales.

This voltage regulator will impact the battery life of the scales, as they do not have a hard power switch and so there will be no way to disconnect it from the battery when not in use. The chosen regulator should therefore have as low a quiescent current draw as possible. To prevent the annoyance of frequent recharging, the  battery life of the converted scales should at least match what it achieved prior to modification - approximately 1-2 months with frequent use. [According to Wikipedia](https://en.wikipedia.org/wiki/List_of_battery_sizes#Lithium_cells) a CR2032 cell has a typical capacity of 225 mAh, which gives a very rough figure to aim for.

To avoid the need for another device-specific charger, the scales should be rechargeable via USB so that they can share the same one used by my phone.  This will also avoid having to remove the battery when it needs charging.  

Finally, if possible the conversion hardware should fit entirely within the existing casework. This would make it more difficult to damage, and reduce clutter on the worktop.

## Conversion details
A rechargeable lithium battery was the obvious choice for the new power supply, as they are very widely available and have a nominal voltage of 3.7 V. This is higher than the required output voltage, which makes it suitable for regulation down to 3 V via a simple dropout regulator.  For this I chose a [Microchip MCP1700-3002E/TO](https://uk.farnell.com/microchip/mcp1700-3002e-to/ic-v-reg-ldo-250ma-to-92-3/dp/1331480), which is capable of supplying up to 250 mA at 3 V from an input voltage of between 3.3 and 6 V. This is more than enough current, and can be supplied from a rechargeable lithium cell. Importantly, it has a very low quiescent current of just 1.6 uA and only requires two external capacitors. 

The battery I selected was an ICR10440, which is an AAA-sized lithium ion battery that will fit in a standard AAA cell holder. This was purchased via eBay and claims a capacity of 360 mAh, 60% more than the original coin cell. A quick calculation using the quiescent current of the chosen regulator suggests that this would take 360 / 1.6*10<sup>-3</sup> = 225000 hours, aka 26 years, to discharge the battery - well below the self discharge rate of the battery.

Having never played with lithium battery charging before, I decided to keep it simple and picked up a [Velleman VMA321](https://cpc.farnell.com/velleman-kit/vma321/lithium-battery-charging-module/dp/SC14418) charging module.  These small boards accept 5 V as an input via either USB or PCB pads, and have two indicator lights to signal charging underway (red) and completed (green). A quick test on the bench for my own piece of mind confirmed that the module did indeed stop supplying current to the battery once it was fully charged.

{% figure "Schematic of electrical components" %}
{% image  "scales_schematic.png" "Schematic of electrical components" 1000%}
{% endfigure %}

All of the electrical components were connected together as in the simple schematic shown above, with a panel-mount micro USB male to female extension cable (eBay) cut in half to provide the USB input socket. The regulator and its associated capacitors were fitted onto a small section of Veroboard and connected to the battery and the weighing scales via 0.1" headers, as I did not have any gendered connectors available at the time.

Below is a photo showing all of the parts for the converted scales.  Visible in the bottom left quarter are several clear acrylic pieces; these are adapters and spacers that were carefully manufactured by hand for mounting the charging module and the regulator board, as this conversion was completed before I had access to a 3D printer. 

{% figure "All of the parts for the USB charging conversion laid out." %}
{% image  "all_parts.jpg" "Weighing scales USB conversion parts" 700%}
{% endfigure %}

The four M1.6 bolts that hold down the charging module also serve as the electrical contacts for it, so the acrylic mounting parts for this were designed such that the module bolts to the acrylic, and then separate bolts hold the acrylic to the case. This avoided exposing the live bolts on the base of the scales, where they might be shorted out. 

Additionally, the acrylic parts support a pair of customised light pipes that transmit the light from the indicator LEDs out to the side of the casework. These were bent by hand, by heating them using a hot air gun and then pressing them around a block of wood, before being cut to size. It took several attempts to produce suitable light pipes this way, as too much heat or too sharp an angle would impair the pipe's light transmission capabilities. The photos below show the fitted light pipes operating within the scales; disappointingly, they do not line up neatly as I failed to drill their mounting holes correctly but they do work. 

{% figure "Red and green lights indicate whether USB charging is underway or completed." %}
{% image  "usb_charging.jpg" "USB charging with red light on" 300%}
{% image  "usb_charged.jpg" "USB charged with green light on" 300%}
{% endfigure %}


Modifications to the scales' baseplate were kept to a minimum, to retain as much structural integrity as possible. The charging module, AAA battery holder and regulator board all sit on top of the 3D grid structure that gives the base its stiffness, and are held in either with countersunk bolts through the base or with cable ties threaded through small holes drilled into the side of the grid elements. 

Sections of the stiffening grid were only removed for the USB mounting socket, visible on the left of the baseplate in the parts photo, so that it could sit flush with the edge of the case and fit between the upper and lower halves of the bodywork.  Even with this material removed, the socket itself had to be shaved down significantly to make it thin enough to fit in the height available. Fortunately the socket's plastic moulding had enough excess material that this wasn't an issue; the end result was a tight enough fit that no glue or mounting hardware was required to retain it securely once the scales were assembled. 

{% figure "The components fitted inside the base of the scales." %}
{% image  "pan_off_after.jpg" "Converted scales without top pan fitted" 700%}
{% endfigure %}

The final arrangement of all of the parts is shown in the photo above.  Everything ended up fitting quite neatly, although during the first test after assembly there was a mild scare when the scales appeared to be wildly inaccurate. This turned out to be because the cable from the USB socket was too high, preventing the top pan from depressing properly when loaded.  Some careful retention of the wire with additional cable ties corrected this, and the scales worked properly again.


## Outcome

As may be apparent from the reference to COVID-19 at the beginning of the post, I actually undertook this project a couple of years ago now. However, I was only recently reminded about writing it up when the scales required their first recharge since they were completed back in 2020. This gives a rough battery life estimate of almost two years - vastly greater than the original coin cells. The rated capacity of the replacement battery was not that much higher than the estimated capacity of a CR2032, which makes me suspect that the cells I was using originally may have been substandard. 

During the intervening two years these scales have seen almost daily use, so the conversion has been very well tested by now. There have been no issues with them during that period either, so I'd consider this project a complete success!