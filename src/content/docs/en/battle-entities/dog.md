---
title: "Dog"
description: "Battle Entity"
---


Pages
Pages are files that live in the src/pages/ subdirectory of your Astro project. They are responsible for handling routing, data loading, and overall page layout for every page in your website.

Supported page files
Section titled Supported page files
Astro supports the following file types in the src/pages/ directory:

.astro
.md
.mdx (with the MDX Integration installed)
.html
.js/.ts (as endpoints)
File-based routing
Section titled File-based routing
Astro leverages a routing strategy called file-based routing. Each file in your src/pages/ directory becomes an endpoint on your site based on its file path.

A single file can also generate multiple pages using dynamic routing. This allows you to create pages even if your content lives outside of the special /pages/ directory, such as in a content collection or a CMS.

📚 Read more about Routing in Astro.

Link between pages
Section titled Link between pages
Write standard HTML <a> elements in your Astro pages to link to other pages on your site.