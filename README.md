# PMT: Pug Media Tool

> PMT is a robust solution for creating PDF media with
[Pug](https://pugjs.org/api/getting-started.html).

[![Version](https://img.shields.io/npm/v/@jonpalmisc/pmt)](https://www.npmjs.com/package/@jonpalmisc/pmt)
[![License](https://img.shields.io/npm/l/@jonpalmisc/pmt)](https://www.npmjs.com/package/@jonpalmisc/pmt)

# Motivation

This project is my attempt to replace LaTeX in my toolchain. I often use LaTeX
to create pretty documents, presentations, etc. - any scenario in which
structured documents are desired.

_This project is still very much under construction. I don't intend to make any
breaking changes, but this is your standard "stuff might break" warning._

# Install

PMT is available via NPM. You can install it like any other NPM package:

```
$ npm i -g @jonpalmisc/pmt
```

# Usage

The most simple usage secenario is as follows, where `<file>` is the the path
to your input:

```
$ pmt <file>
```

This will process your input file (Pug) and produce a PDF adjacent to it using
the internal (Chromium-based) PDF engine.

If you would like to use an alternate HTML-to-PDF engine such as
[Prince](https://www.princexml.com/) or [WeasyPrint](https://weasyprint.org/),
you can instruct PMT to produce HTML output instead with the `-x` or `--html`
flags:

```
$ pmt -x <file>
```

For advanced usage, use the `-h` or `--help` flags for more information.

# Examples

One thing PMT is sorely lacking is example documents, etc. While they are not
written in Pug and do not leverage PMT's syntax, the
[PrinceXML Samples](https://www.princexml.com/samples/) and
[WeasyPrint Samples](https://weasyprint.org/samples/) should serve to
demonstrate the level of visual fidelity PMT is capable of, as they utilize
similar technology. 

_I aim to create some examples and add them to the repo soon! Unfortunately,
most of my existing work done in PMT is not publicly-sharable._

# Default plugins

A handful of "plugins" are included by default. You can learn more about them
in the following sections.

## Markdown

You can write Markdown in your documents using the `:markdown` filter:

```pug
:markdown
  # An exciting heading

  With an even more exciting paragraph
```

## SCSS

You can write SCSS in your documents or include SCSS files using the `:scss`
filter:

```pug
style
  include:scss local.scss

  :scss
    html {
      font-family: sans-serif;
    }
```

You can also leverage the (somewhat limited) "standard library" of styles from
either inline SCSS or from included files:

```pug
style
  :scss
    @import "std/base"
```

# Extra plugins

The plugins in the sections below are also included with a standard install,
but are not enabled by default.  You can enable them via the `-p` flag. See the
usage information for more details.

## MathJax

You can write math equations to be automatically typeset by MathJax:

```pug
p Look, here's an inline square root: $\sqrt{x}$.

p Below, you can find a display equation:
p $$\int_a^b 6x \,dx = 3x^2 \Big|_a^b$$
```

## Mermaid

Support for creating diagrams with Mermaid is included. You can define your
diagrams in the body of a `:mermaid` filter:

```pug
:mermaid
  graph LR
    A[Start] --> B[End]
```

**Hint:** You must explicitly set your document's doctype (`doctype html`),
otherwise Mermaid may not work as expected.

## Smart quotes

The smart quotes plugin will automatically replace "dumb quotes" with
typographically correct quote characters.

## Syntax highlighting

There are two built-in plugins for syntax highlighting: one for Highlight.js
and one for Prism.js, named `highlight` and `prism`, respectively. If you
enable these plugins, **you must** use the default highlighting stylesheet
(found in the include folder) **or** bring your own. Otherwise, it will appear
as if nothing is happening! See the documentation for each highlighter for more
info on customization.

## Page polyfill

Chrome doesn't support some of the more fancy paged CSS features, but you can
enable them through a polyfill with the `pages` plugin, which uses Paged.js
under the hood.

# License

Copyright &copy; 2020 Jon Palmisciano. See LICENSE.txt for more information.
