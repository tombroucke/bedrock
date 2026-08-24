---
name: animate
description: Add animation to html elements
---

All animations, like fade-in, translating, ... should be done with gsap (most likely in combination with ScrollTrigger). If elements inside an acf block are animated, the code should go into the block .scss and .js file. Make sure elements are properly invisible when loading the page, so the user doesn't experience any flickering before the JavaScript is loaded.
